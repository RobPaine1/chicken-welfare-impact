# TODO

## Data

- [x] **Per-cause bounds and primary WFP data.** Done without the CSV:
      `scripts/fetch_paintrack.py` reads the dataset embedded in
      pain-track.org/broilers (every burden's expected hours per intensity for
      the average bird, with standard deviations and prevalence, for the
      Conventional and Reformed systems) and the published totals with 90%
      intervals from the Tableau workbook (CSV export per intensity via
      `...Broilers.csv?:showVizHome=no&Intensity=<level>`). Output: `docs/wfp.js`;
      raw copies in `data/`. Per-cause intervals are derived (scaled
      independent-sum standard deviations, calibrated to the published totals).
- [x] **By-intensity numbers confirmed** against the project's own workbook.
      The old pipeline's lameness figure (457.9 h) was wrong; the correct sum
      of the seven lameness burdens is 378.7 h. The by-cause and by-intensity
      totals now agree exactly (708.6 h conventional) once the two breeder-hen
      burdens are included, which the project's own total does.
- [x] **Sleep.** Confirmed from welfarefootprint.org/broilers: the hours of pain
      count "only hours awake". No sleep adjustment; the page's Notes say so.
- [x] **Edible share and dressing range.** The 0.74 edible share had no real
      source. Replaced with USDA SR28 refuse data: whole broiler raw, meat and
      skin, 32% refuse (68% edible, used); meat only, 52% refuse (48%, used as
      the low bound). Dressing 73.5% with the Wisconsin Extension 72–75% range.
      Step 1 now carries an interval and the final number combines it with
      the harm interval. Net effect: about 11% more chicken per serving than
      before.
- [x] Re-ran `scripts/fetch_paintrack.py` live on 2026-09-05: data unchanged.
- [ ] Re-run it occasionally; the project revises its estimates.

## Scope

- [ ] Eggs: hens per egg (eggs per layer per year, hen lifespan) and the WFP
      laying-hen pain estimates, which have the same mean + 90% structure.
- [ ] Other meats (turkey, pork, beef): lives and days of life only, until
      cumulative-pain estimates exist. Constants for these are in
      `archive/site-v2/calc.js`.
- [x] Higher-welfare chicken toggle (WFP reformed scenario: 2.5 kg at 56 days).

## Pipeline

- [ ] The R pipeline in `scripts/` sums breeder-hen harms (hunger,
      peritonitis) into each meat bird. Filter by animal type before summing.
