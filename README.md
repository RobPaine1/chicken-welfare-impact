# Chicken welfare calculator

`docs/index.html` is a single plain HTML page, served by GitHub Pages, that
shows the equation behind the chicken welfare numbers. You type in ounces of
cooked chicken and every step of the calculation updates in place:

1. cooked weight → raw weight → fraction of a chicken (USDA production data,
   yield percentages)
2. that fraction × hours of pain per chicken, by cause and by intensity
   (Welfare Footprint Project, conventional broilers)

No CSS, no build step, no dependencies. The constants and their sources are
listed on the page and in the page's script.

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
