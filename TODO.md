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

## Site (added 2026-09-05)

- [x] Add photos for the common items you can pick on the Calculator. Done with
      Wikimedia Commons photos (CC0, CC BY, CC BY-SA); credits in `docs/photos.js`
      and at the bottom of the page.
- [x] Weekly intake: the "Over the long run" block under the results takes
      times a week and years and scales the same numbers up.
- [ ] A "typical American" preset for the long-run block, once a sourced
      weekly figure (USDA per-capita chicken) is in hand.
- [ ] Fuller descriptions of the harms (currently one line each in
      `docs/text.js`). The Harms page now carries the report's own definitions
      and every page of the report per harm; the calculator's one-liners are
      unchanged.
- [ ] Fix the equation colours.
- [x] Add an About page (`docs/about.html`; text in `text.js` under `about`).
- [ ] Add more text to the Methodology page (its Notes section).
- [ ] Double-check every number, source and equation, and make sure they
      make sense to a reader (personally understand them).
- [ ] Fix the subscripts in the equations.
