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

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode('utf-8', 'ignore')

def main():
    html = fetch(URL) if len(sys.argv) < 2 else open(sys.argv[1], encoding='utf-8', errors='ignore').read()
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    data = json.loads(m.group(1))['props']['pageProps']
    json.dump(data, open('data/paintrack_broilers_raw.json', 'w'), indent=1)

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

    out = {'source': URL, 'tableau': 'https://public.tableau.com/app/profile/cynthia.schuck/viz/BroilerChickens2021/Broilers',
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
            c['total_lo'] = max(0.0, c['total'] - Z90 * sd_tot)
            c['total_hi'] = c['total'] + Z90 * sd_tot
            for k in ('sd', 'sd_corr'):
                c.pop(k, None)
        out['systems'][sysname] = {'name': ps['name'], 'causes': rows, 'total': tot, 'published': pub, 'scale': scale}
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
