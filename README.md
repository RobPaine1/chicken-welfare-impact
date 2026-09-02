# Meat Welfare Calculator

A one-page calculator: enter how much chicken, turkey, pork and beef you eat in a
typical week and see how many animals that uses, how many days of animal life it
represents and, for chicken, how many hours of pain it involves.

Live site: the `docs/` folder is served by GitHub Pages.

## How the numbers work

Everything is one chain of multiplications, with every constant sourced:

```
animals used  = cooked meat eaten ÷ cooking yield ÷ raw edible meat per animal
days of life  = animals used × days each animal lives
hours of pain = animals used × hours of pain per animal      (chicken only)
```

Raw edible meat per animal comes from USDA 2024 production totals (pounds ÷ head),
a dressing percentage (live → carcass, poultry only; USDA reports pork and beef
on a carcass basis) and an edible-meat share of the carcass.

Hours of pain per chicken come from the Welfare Footprint Project's cumulative
pain estimates for a conventional fast-growing broiler, both by intensity
(Annoying, Hurtful, Disabling, Excruciating) and by cause (lameness, behavioural
deprivation, heat stress, ascites, sudden death).

The full worked example, constant table, limitations and source list are rendered
on the page itself from the same constants the calculator uses, so they cannot
drift apart.

## Files

- `docs/index.html` – the page (markup, styles, UI code).
- `docs/calc.js` – every constant, its source, and the pure formulas. Start here
  if you want to change or audit a number.
- `tests/calc.test.js` – unit tests for the formulas and sanity checks against
  published figures. Run with `npm test` (Node 18+).
- `scripts/` – the original R pipeline that estimated chicken content of specific
  FNDDS foods and joined it to the Welfare Footprint per-harm dataset. Kept for
  reference; the site no longer depends on it. Two issues were found in it while
  rebooting: seconds were converted to hours by dividing by 60 (now fixed to
  3600), and the "Conventional" filter also picked up broiler-breeder harms
  (hunger, peritonitis) as if every meat bird endured them. The raw data files it
  reads are not in the repo.
- `output/chicken_food_impacts.json` – last output of that pipeline (per-food
  chicken grams and pain hours). Unused by the site.

## Running locally

```
npm test          # run the formula tests
npm run serve     # serve docs/ at http://localhost:8000
```

The page also works when opened directly as a file; it has no build step and no
network dependencies.

## Main sources

- USDA NASS, Poultry – Production and Value 2024 Summary
- USDA NASS, Livestock Slaughter 2024 Summary
- Welfare Footprint Institute, Broilers (cumulative time in pain) and Pain-Track data
- Schuck-Paim & Alonso (2022), Quantifying Pain in Broiler Chickens
- University extension yield guides (Maine, Wisconsin, South Dakota State) and the
  USDA Table of Cooking Yields for Meat and Poultry

See the "Sources" list at the bottom of the page for links and the note attached
to each constant.
