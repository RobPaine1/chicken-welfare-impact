# TODO

## Data

- [ ] **Add per-cause bounds to the by-cause block.** The Welfare Footprint
      Project's per-harm dataset (the CSV the R pipeline reads,
      `data/raw/WFP Estimates of Time in Pain - Broilers (Farm) - Time in Pain per Harm.csv`)
      has "Lower bound" and "Upper bound" columns next to the mean for every
      harm. That file is gitignored and not in this environment. Once it is
      added (or the seven lower/upper pairs are pasted in), fill the `null`
      slots in the `HARMS` array in `docs/index.html` so the by-cause block
      shows brackets like the by-intensity block does. Also use it to
      reconcile the ~4% gap between the by-cause and by-intensity totals.
- [ ] Confirm the exact WFP central values and 90% bounds by intensity
      against the project's own page or book, rather than the secondary
      summary they were taken from (`welfarefootprint.org/broilers`).
- [ ] Find a better-cited source for the 0.74 edible share and a range for
      dressing percentage, so step 1 can carry an interval too.

- [ ] **Confirm how the WFP estimates treat sleep.** The per-harm durations are
      meant to be time the bird actually experiences the pain, and I believe the
      project counts waking hours only for chronic conditions, but this was not
      verified from the primary text in this environment. Check the methods
      chapters of *Quantifying Pain in Broiler Chickens* (and the Pain-Track
      notes). Do not add a separate sleep factor unless that check shows the
      published hours include sleep; if they do, expose any adjustment as an
      explicit, optional, user-visible step rather than a hidden multiplier.

## Scope

- [ ] Eggs: hens per egg (eggs per layer per year, hen lifespan) and the WFP
      laying-hen pain estimates, which have the same mean + 90% structure.
- [ ] Other meats (turkey, pork, beef): lives and days of life only, until
      cumulative-pain estimates exist. Constants for these are in
      `archive/site-v2/calc.js`.
- [ ] Higher-welfare chicken toggle using WFP's reformed / Better Chicken
      Commitment scenario.

## Pipeline

- [ ] The R pipeline in `scripts/` sums breeder-hen harms (hunger,
      peritonitis) into each meat bird. Filter by animal type before summing.
