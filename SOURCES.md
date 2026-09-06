# Sources for every input

One line per number the site uses, what it is used for, and where it comes from.
"Verified" means the figure was read from the source itself during the build;
"estimate" means it is a judgement that still needs a citation.

## The equation (Methodology page)

| Input | Value | Used for | Source | Status |
|---|---|---|---|---|
| Grams per ounce | 28.35 | oz → g | Definition | Exact |
| Cooking yield | 0.75 (range 0.65–0.75) | cooked → raw meat | USDA ARS, Table of Cooking Yields for Meat and Poultry, Release 2 (`data/usda_cooking_yields_meat_poultry_r2.xlsx`): chicken, whole broiler-fryer roasted 78% (min 68, max 84); breast 72% (61–82); thigh 69% (58–79); drumstick 76% (63–87); wing roasted 78%, floured and deep-fried 66% (53–78). These are bone-in yields; bone does not shrink, so the meat’s own yield is lower. SR28 paired weights give it directly: items 05006/05009, 276 g raw → 178 g roasted meat and skin per lb ready-to-cook (0.65); 05011/05013, 197 g → 146 g meat only (0.74) | Verified from both files; 0.75 is the high (conservative) end |
| Live weight of the scenario bird | 2.5 kg at 42 days (conventional); 2.5 kg at 56 days (reformed) | raw meat per bird; days of life | Welfare Footprint Project, *Quantifying Pain in Broiler Chickens*, Chapter 1 p. 5 (`data/report/01-introduction.pdf`) | Verified |
| Dressing percentage | 73.5% (range 72–75%) | live weight → ready-to-cook carcass | [University of Wisconsin Extension, Bird Breakdown](https://livestock.extension.wisc.edu/articles/bird-breakdown-exploring-yields-and-cuts-of-poultry/) (72–75% for a 6.5 lb commercial broiler) | Verified |
| Definition of dressing percentage | hot carcass weight ÷ live weight, minus giblets (heart, liver, gizzard) and neck | basis of the dressing figure | [University of Maine Extension, Understanding Poultry Yields](https://extension.umaine.edu/publications/2223e/) | Verified |
| Edible share, meat and skin | 68% | carcass → raw meat | [USDA SR28](https://www.ars.usda.gov/northeast-area/beltsville-md-bhnrc/beltsville-human-nutrition-research-center/methods-and-application-of-food-composition-laboratory/mafcl-site-pages/sr11-sr28/), item 05006 “Chicken, broilers or fryers, meat and skin, raw”: 32% refuse (bone) | Verified from the SR28 data files |
| Ready-to-cook basis (resolved) | — | check on the edible share | SR28 item 05006 gives 276 g raw meat and skin per lb ready-to-cook chicken (61%); that pound includes neck and giblets, about 7% of live weight per Wisconsin Extension, and without them the figure is about 67%. The Maine definition of dressing percentage excludes giblets and neck, so the 68% refuse figure is the right share to apply to the 72–75% carcass | Resolved; the two USDA figures agree |
| Edible share without skin | 56% | low end of the range | USDA SR28 item 05011 “meat only, raw”: 52% refuse = 32% bone + 12% skin + 8% separable fat; dropping skin alone leaves 56% | Verified from the SR28 data files |
| Hours of pain per bird, by harm and intensity | e.g. lameness 378.7 h | harm per lifetime | [Welfare Footprint Project Pain-Track for broilers](https://pain-track.org/broilers) (the dataset embedded in the page; raw copy in `data/paintrack_broilers_raw.json`) | Verified; reproduces the published totals exactly |
| Totals by intensity with 90% intervals | e.g. Disabling 50.3 h [33.0–67.5] | intensity table; interval calibration | [Broiler Chickens 2021 Tableau workbook](https://public.tableau.com/app/profile/cynthia.schuck/viz/BroilerChickens2021/Broilers) (CSV export per intensity; copies in `data/tableau_*.csv`) | Verified |
| “Only hours awake are considered” | — | notes | [Welfare Footprint Project, Broilers overview](https://welfarefootprint.org/broilers/) and Chapter 1 Box 3 | Verified |
| Slaughter: hours and seconds of pain per bird | e.g. 6.4 s excruciating | the Stunning and slaughter harm | [Pain-Track for stunning and slaughter](https://cp.pain-track.org/broilers/stunning) (raw copy in `data/paintrack_stunning_raw.json`); scenario choice from Chapter 8 | Verified; matches the report’s own figure |
| Failed-stun rates | 5–70% conscious after the stunner; 0.01–6% scalded alive (unregulated) | wording on the harm | Chapter 8 pp. 6–8 (`data/report/08-stunning.pdf`) | Verified |
| Pain intensity definitions | — | intensity table wording | Chapter 1 Box 1; [project definitions](https://welfarefootprint.org/broilers/) | Verified |

Context figures shown in the notes but not used in the equation:

| Input | Value | Source | Status |
|---|---|---|---|
| US broilers produced and live weight, 2024 | 9.33 billion birds, 61.1 billion lb (2.97 kg per bird) | [USDA NASS, Poultry Production and Value 2024 Summary](https://www.nass.usda.gov/Publications/Todays_Reports/reports/plva0425.pdf) | Verified |
| US market age | about 47 days | [National Chicken Council, U.S. Broiler Performance](https://www.nationalchickencouncil.org/about-the-industry/statistics/u-s-broiler-performance/) | Verified earlier in the build; the page now blocks automated access |

## The “typical American’s week” preset

| Input | Value | Source | Status |
|---|---|---|---|
| Chicken available per person per year, boneless edible basis | 68.1 lb (2021) | [USDA ERS, Chicken leads U.S. per person availability of meat over last decade](https://www.ers.usda.gov/data-products/charts-of-note/chart-detail?chartId=105929) | Verified |
| Conversion to a cooked week | 68.1 lb × 453.6 ÷ 52 × 0.75 = 445 g = 15.7 oz | Arithmetic, using the cooking yield above | — |
| Caveat | Availability is before plate waste and spoilage, so it overstates what is eaten | [ERS loss-adjusted food availability documentation](https://www.ers.usda.gov/data-products/food-availability-per-capita-data-system/loss-adjusted-food-availability-documentation) | The loss-adjusted chicken figure itself has not yet been retrieved |

## The common items

The grams of cooked chicken meat in each item are estimates made while building
the site. None has a citation yet. They drive the headline directly, so
they are the highest-value thing left to source, ideally from the chains’ own
nutrition pages (serving weight, and protein grams as a cross-check: cooked
chicken is roughly 25–30 g protein per 100 g).

| Item | Cooked chicken used | Basis | Status |
|---|---|---|---|
| Chick-fil-A Chicken Sandwich | 100 g | one breaded breast filet, breading excluded | Estimate |
| Chick-fil-A Nuggets, 8 count | 95 g | eight nuggets, breading excluded | Estimate |
| McDonald’s McNuggets, 10 piece | 80 g | about half of each nugget is chicken | Estimate |
| Popeyes Chicken Sandwich | 110 g | one breaded breast filet, breading excluded | Estimate |
| KFC 2-piece, thigh and drumstick | 140 g | meat only, bone and skin excluded | Estimate |
| Chipotle chicken bowl or burrito | 113 g | Chipotle’s stated 4 oz serving of chicken | Estimate; the 4 oz figure is Chipotle’s |
| Grilled chicken breast, restaurant | 170 g | a 6 oz breast | Estimate |
| Half a rotisserie chicken | 280 g | meat only from half a typical 3 lb ready-to-cook bird | Estimate |
| 6 buffalo wings | 90 g | meat only, about 15 g per wing | Estimate |
| Chicken Caesar salad | 85 g | a typical 3 oz topping | Estimate |
| Bowl of chicken noodle soup | 25 g | a canned or restaurant bowl | Estimate |

## Photos

Every photo is from Wikimedia Commons under CC0, CC BY or CC BY-SA; the file,
photographer and licence for each are in `docs/photos.js` and listed on the
calculator under “Photo credits”.

## The report

Schuck-Paim C & Alonso WJ (eds). *Quantifying Pain in Broiler Chickens*.
Welfare Footprint Project, 2022. Chapter PDFs in `data/report/`; page images
in `docs/report/`. Licence for reproducing the pages: not yet confirmed with
the authors.
