#!/usr/bin/env python3
"""Fetch the Welfare Footprint Project's broiler Pain-Track data and write docs/wfp.js.

pain-track.org/broilers is a Next.js page that embeds its dataset in a
__NEXT_DATA__ script tag: two production systems (Conventional, Reformed),
each a list of "burdens" (one per welfare harm and severity level) with the
expected hours per average bird at each pain intensity, the standard deviation
of that expectation, and the prevalence range used.

The project's published totals with 90% intervals come from its Tableau Public
workbook (BroilerChickens2021), exported as CSV per intensity. The per-cause
intervals here are the independent-sum standard deviations of each cause's
burdens, scaled so that the same rule reproduces the published interval for the
system-wide total at that intensity.

This script aggregates the burdens into named causes and writes a small JS
file the calculator loads. Run:  python3 scripts/fetch_paintrack.py
(pass a saved copy of the page as the first argument to work offline).
"""
import csv, io
import json, re, sys, math, datetime, urllib.request

URL = 'https://pain-track.org/broilers'
STUN_URL = 'https://cp.pain-track.org/broilers/stunning'   # the project's stunning and slaughter Pain-Tracks
TABLEAU = 'https://public.tableau.com/views/BroilerChickens2021/Broilers.csv?:showVizHome=no&Intensity='
Z90 = 1.645   # half-width of a 90% interval in standard deviations, if normal
LEVELS = ['annoying', 'hurtful', 'disabling', 'excruciating']

# Burden name fragment -> cause. Order matters (first match wins).
CAUSES = [
    ('Lameness',            'Lameness',                 'leg and joint disorders from growing too fast; walking hurts or becomes impossible'),
    ('Ascites',             'Ascites',                  'fluid builds up in the abdomen when the heart cannot keep up with rapid growth'),
    ('Sudden Death',        'Sudden death syndrome',    'acute heart failure; brief but intense, so it adds almost no hours'),
    ('Heat Stress',         'Heat stress',              'heavy birds in crowded sheds cannot shed heat; they pant and become lethargic'),
    ('Foraging',            'No foraging or exploring', 'barren sheds with nothing to scratch, peck or investigate'),
    ('Perching',            'No perching',              'no raised places to rest, which chickens seek out for safety'),
    ('Dustbathing',         'No dustbathing',           'no loose, dry substrate for the bathing behaviour that keeps feathers healthy'),
    ('Hunger',              'Breeder hen hunger',       'the parent hens are kept chronically hungry to limit their growth; their pain is spread over the chicks each produces'),
    ('Peritonitis',         'Breeder hen peritonitis',  'infection of the abdomen in the parent hens, spread over the chicks each produces'),
]

# Slaughter scenario used for each production system. The report expects low-voltage, high-frequency
# electrical waterbath stunning (set to limit carcass damage) to prevail in the US, China and Brazil;
# the Better Chicken Commitment requires controlled-atmosphere (CO2) stunning.
STUN_SCENARIO = {'conventional': 'E: lowV-highF', 'reformed': 'CO2: proper'}
STUN_NAME = 'Stunning and slaughter'
STUN_WHAT = 'hung upside down in shackles and stunned; the birds the stun fails on are cut and scalded while conscious'
# Kinds within the slaughter harm: (label, regex on the burden name). First match wins.
STUN_KINDS = [
    ('Stun: Scalded alive',                 r'scald'),
    ('Stun: Pre-stun shocks',               r'pre-?\s?stun'),
    ('Stun: Failed stun',                   r'immobili|waterbath[^)]*(?:improper|ineffective)|stun-?\s?to-?\s?neck'),
    ('Stun: Neck cut while conscious',      r'neck cutting|cutting|bleeding'),
    ('Stun: Gas stun',                      r'co2.*stunner'),
    ('Stun: Electrical stun',               r'electronarcosis|electrocution|waterbath'),
    ('Stun: Shackling',                     r'leg compression|inversion|wing fracture|shackl'),
]

def slaughter_cause(stun_data, scenario):
    """One cause for the slaughter process, built from the stunning Pain-Tracks of one scenario."""
    ps = next(p for p in stun_data['apiProductionSystems'] if p['name'] == scenario)
    kinds = {}
    for b in ps['burdens']:
        label = next((k[0] for k in STUN_KINDS if re.search(k[1], b['name'], re.I)), None)
        if label is None:
            print('UNMAPPED stunning burden:', b['name'], file=sys.stderr); continue
        k = kinds.setdefault(label, {'name': label, 'burdens': [], 'mean': {l: 0.0 for l in LEVELS}, 'var': {l: 0.0 for l in LEVELS}})
        k['burdens'].append(b['name'])
        for l in LEVELS:
            k['mean'][l] += b['resume'][l]['expected_time_spent']
            k['var'][l] += b['resume'][l]['standard_deviation'] ** 2
    parts = []
    for label, _ in STUN_KINDS:
        if label not in kinds: continue
        k = kinds[label]; sd = {l: math.sqrt(k['var'][l]) for l in LEVELS}
        k['lo'] = {l: max(0.0, k['mean'][l] - Z90 * sd[l]) for l in LEVELS}
        k['hi'] = {l: k['mean'][l] + Z90 * sd[l] for l in LEVELS}
        k['total'] = sum(k['mean'].values()); psd = math.sqrt(sum(v ** 2 for v in sd.values()))
        k['total_lo'] = max(0.0, k['total'] - Z90 * psd); k['total_hi'] = k['total'] + Z90 * psd
        k['sd'] = sd; del k['var']
        parts.append(k)
    c = {'name': STUN_NAME, 'what': STUN_WHAT, 'scenario': scenario, 'source': STUN_URL,
         'burdens': [b for k in parts for b in k['burdens']], 'parts': parts,
         'mean': {l: sum(k['mean'][l] for k in parts) for l in LEVELS}}
    c['sd_indep'] = {l: math.sqrt(sum(k['sd'][l] ** 2 for k in parts)) for l in LEVELS}
    # No published totals exist for these Pain-Tracks, so the intervals are the plain independent sums (scale 1).
    c['lo'] = {l: max(0.0, c['mean'][l] - Z90 * c['sd_indep'][l]) for l in LEVELS}
    c['hi'] = {l: c['mean'][l] + Z90 * c['sd_indep'][l] for l in LEVELS}
    c['total'] = sum(c['mean'].values()); sd_tot = math.sqrt(sum(v ** 2 for v in c['sd_indep'].values()))
    c['total_lo'] = max(0.0, c['total'] - Z90 * sd_tot); c['total_hi'] = c['total'] + Z90 * sd_tot
    for k in parts: del k['sd']
    return c

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode('utf-8', 'ignore')

def main():
    # Live from pain-track.org, or offline from a saved copy of the page (argv[1] = .html) or of the
    # extracted data (argv[1] = data/paintrack_broilers_raw.json).
    if len(sys.argv) > 1 and sys.argv[1].endswith('.json'):
        data = json.load(open(sys.argv[1]))
    else:
        html = fetch(URL) if len(sys.argv) < 2 else open(sys.argv[1], encoding='utf-8', errors='ignore').read()
        m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
        data = json.loads(m.group(1))['props']['pageProps']
        json.dump(data, open('data/paintrack_broilers_raw.json', 'w'), indent=1)

    # The stunning and slaughter Pain-Tracks, from the project's second app (or the saved copy if offline).
    try:
        m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', fetch(STUN_URL), re.S)
        stun = json.loads(m.group(1))['props']['pageProps']
        json.dump(stun, open('data/paintrack_stunning_raw.json', 'w'), indent=1)
    except Exception as e:
        print('Stunning fetch failed (%s); using cached data/paintrack_stunning_raw.json' % e, file=sys.stderr)
        stun = json.load(open('data/paintrack_stunning_raw.json'))

    # Published totals (mean and 90% interval per intensity and system) from the Tableau workbook.
    published = {}
    for level in LEVELS:
        name = level.capitalize()
        try:
            text = fetch(TABLEAU + name)
            open('data/tableau_%s.csv' % level, 'w').write(text)
        except Exception as e:
            print('Tableau fetch failed for %s (%s); using cached data/tableau_%s.csv' % (name, e, level), file=sys.stderr)
            text = open('data/tableau_%s.csv' % level).read()
        for row in csv.DictReader(io.StringIO(text)):
            if row['Measure Names'] != 'Pain-Mean Pop Bird':
                continue
            k = 3600.0 if level == 'excruciating' else 1.0    # the workbook reports Excruciating in seconds
            published.setdefault(row['Housing'].lower(), {})[level] = {
                'mean': float(row['Pain-Mean Pop Bird']) / k,
                'lo': float(row['Population Lower  90%']) / k,
                'hi': float(row['Population Upper 90%']) / k}

    out = {'source': URL, 'stunning': STUN_URL, 'tableau': 'https://public.tableau.com/app/profile/cynthia.schuck/viz/BroilerChickens2021/Broilers',
           'retrieved': datetime.date.today().isoformat(), 'systems': {}}
    for ps in data['apiProductionSystems']:
        sysname = ps['name'].lower()
        causes = {}
        for b in ps['burdens']:
            cause = next((c for c in CAUSES if c[0].lower() in b['name'].lower()), None)
            if cause is None:
                print('UNMAPPED burden:', b['name'], file=sys.stderr); continue
            key = cause[1]
            c = causes.setdefault(key, {'name': key, 'what': cause[2], 'burdens': [], 'mean': {l: 0.0 for l in LEVELS},
                                        'var': {l: 0.0 for l in LEVELS}, 'sd_corr': {l: 0.0 for l in LEVELS}})
            r = b['resume']
            c['burdens'].append(b['name'])
            c.setdefault('parts', []).append({'name': b['name'], 'prevalence': b.get('prevalence'),
                'mean': {l: r[l]['expected_time_spent'] for l in LEVELS}, 'sd': {l: r[l]['standard_deviation'] for l in LEVELS}})
            for l in LEVELS:
                c['mean'][l] += r[l]['expected_time_spent']
                c['var'][l] += r[l]['standard_deviation'] ** 2     # sum as if burdens were independent
                c['sd_corr'][l] += r[l]['standard_deviation']       # sum as if burdens were fully correlated
        rows = []
        for key in [c[1] for c in CAUSES if c[1] in causes]:
            c = causes[key]
            c['sd_indep'] = {l: math.sqrt(c['var'][l]) for l in LEVELS}
            del c['var']
            # The project's published 90% intervals for the totals fall between the independent and
            # fully-correlated sums; their geometric mean reproduces them to within about 1%.
            c['sd'] = {l: math.sqrt(c['sd_indep'][l] * c['sd_corr'][l]) for l in LEVELS}
            c['total'] = sum(c['mean'].values())
            rows.append(c)
        tot = {l: sum(c['mean'][l] for c in rows) for l in LEVELS}
        sd_quad = {l: math.sqrt(sum(c['sd_indep'][l] ** 2 for c in rows)) for l in LEVELS}
        pub = published[sysname]
        # Scale factor per intensity: published half-width vs. the independent-sum standard deviation.
        scale = {}
        for l in LEVELS:
            pub_sd = (pub[l]['hi'] - pub[l]['lo']) / 2 / Z90
            scale[l] = pub_sd / sd_quad[l] if sd_quad[l] > 0 else 1.0
        for c in rows:
            c['lo'] = {l: max(0.0, c['mean'][l] - Z90 * scale[l] * c['sd_indep'][l]) for l in LEVELS}
            c['hi'] = {l: c['mean'][l] + Z90 * scale[l] * c['sd_indep'][l] for l in LEVELS}
            sd_tot = math.sqrt(sum((scale[l] * c['sd_indep'][l]) ** 2 for l in LEVELS))
            for part in c['parts']:   # each burden (e.g. one gait score) gets the same interval rule as its cause
                part['lo'] = {l: max(0.0, part['mean'][l] - Z90 * scale[l] * part['sd'][l]) for l in LEVELS}
                part['hi'] = {l: part['mean'][l] + Z90 * scale[l] * part['sd'][l] for l in LEVELS}
                part['total'] = sum(part['mean'].values())
                psd = math.sqrt(sum((scale[l] * part['sd'][l]) ** 2 for l in LEVELS))
                part['total_lo'] = max(0.0, part['total'] - Z90 * psd); part['total_hi'] = part['total'] + Z90 * psd
            c['total_lo'] = max(0.0, c['total'] - Z90 * sd_tot)
            c['total_hi'] = c['total'] + Z90 * sd_tot
            for k in ('sd', 'sd_corr'):
                c.pop(k, None)
        rows.append(slaughter_cause(stun, STUN_SCENARIO[sysname]))   # after the farm harms; not part of the published totals
        out['systems'][sysname] = {'name': ps['name'], 'causes': rows, 'total': tot, 'published': pub, 'scale': scale,
                                   'slaughter': {'scenario': STUN_SCENARIO[sysname], 'source': STUN_URL}}
        print('\n%s: totals by intensity (h):' % ps['name'], {l: round(v, 2) for l, v in tot.items()})
        print('  published:', {l: (round(pub[l]['mean'], 2), round(pub[l]['lo'], 2), round(pub[l]['hi'], 2)) for l in LEVELS})
        print('  interval scale factors:', {l: round(v, 2) for l, v in scale.items()})
        for c in rows:
            print('  %-28s total %7.1f h [%6.1f-%6.1f]   A %6.1f  H %6.1f  D %6.1f  E %5.1f s   from %d burdens' % (
                c['name'], c['total'], c['total_lo'], c['total_hi'], c['mean']['annoying'], c['mean']['hurtful'], c['mean']['disabling'], c['mean']['excruciating'] * 3600, len(c['burdens'])))

    js = '// Generated by scripts/fetch_paintrack.py from ' + URL + ' on ' + out['retrieved'] + '. Do not edit by hand.\nvar WFP = ' + json.dumps(out, indent=1) + ';\n'
    open('docs/wfp.js', 'w').write(js)
    print('\nwrote docs/wfp.js and data/paintrack_broilers_raw.json')

if __name__ == '__main__':
    main()
