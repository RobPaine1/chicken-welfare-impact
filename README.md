# Chicken welfare calculator

`docs/index.html` is a single plain HTML page, served by GitHub Pages. You type
in ounces of cooked chicken and see one equation:

    Specific Harm / Serving = Animal Lifetime / Serving × Specific Harm / Animal Lifetime

Terms are written as word fractions so units cancel visibly, with the equation
in words on the left and the same equation in numbers on the right. A row that
is computed from other rows unfolds *upward*: click it and its terms appear
above it with the operator between them and a line under them, so the row is
their result and stays in place in the larger equation. Fully unfolded, the page
reads top to bottom from the raw inputs (ounces eaten, USDA production figures,
yield percentages) to the hours of harm behind the serving. Equations are typeset with
KaTeX, vendored in `docs/katex/`. No CSS of our own, no build step.

Open items are tracked in `TODO.md`.

## Archive

- `archive/site-v2/` – the earlier two-page calculator (meal presets, weekly
  view, turkey/pork/beef, explanation page). `calc.js` there holds every
  constant with its source; `npm test` runs its unit tests.
- `scripts/` – the original R pipeline that estimated chicken content of
  specific FNDDS foods and joined it to the Welfare Footprint per-harm
  dataset. Its raw data files are not in the repo. Two bugs were found and
  noted while rebooting: seconds were divided by 60 instead of 3600 (fixed),
  and the "Conventional" filter also picked up broiler-breeder harms.
- `output/chicken_food_impacts.json` – last output of that pipeline.

## Main sources

- USDA NASS, Poultry Production and Value 2024 Summary
- University of Maine and University of Wisconsin extension poultry yield guides
- USDA Table of Cooking Yields for Meat and Poultry
- National Chicken Council, U.S. Broiler Performance
- Welfare Footprint Institute, Broilers and Pain-Track data;
  Schuck-Paim & Alonso (2022), Quantifying Pain in Broiler Chickens
