// All the words on both pages live here. Edit freely; nothing in this file affects the numbers.
//
// Curly-brace placeholders such as {days} are filled in by the page. Keep them as they are,
// but you can move them around or drop them. HTML tags like <b> are allowed.
var TEXT = {

  // ---- Shared -------------------------------------------------------------
  nav: { calculator: 'Calculator', methodology: 'Methodology', harms: 'Harms', about: 'About' },

  // What each harm is. Keys must match the names produced by scripts/fetch_paintrack.py.
  harms: {
    'Lameness':                'leg and joint disorders from growing too fast; walking hurts or becomes impossible',
    'Ascites':                 'fluid builds up in the abdomen when the heart cannot keep up with rapid growth',
    'Sudden death syndrome':   'acute heart failure; brief but intense, so it adds almost no hours',
    'Heat stress':             'heavy birds in crowded sheds cannot shed heat; they pant and become lethargic',
    'No foraging or exploring': 'barren sheds with nothing to scratch, peck or investigate',
    'No perching':             'no raised places to rest, which chickens seek out for safety',
    'No dustbathing':          'no loose, dry substrate for the bathing behaviour that keeps feathers healthy',
    'Breeder hen hunger':      'the parent hens are kept chronically hungry to limit their growth; their pain is spread over the chicks each produces',
    'Breeder hen peritonitis': 'infection of the abdomen in the parent hens, spread over the chicks each produces',
    'Stunning and slaughter':  'hung upside down in shackles, then electrically stunned. Where stunning is unregulated, the report estimates 5 to 70% of birds are still conscious after the stunner and 0.01 to 6% reach the scalding tank alive'
  },

  // The kinds within each harm, as the Welfare Footprint Project splits them (its "burden" names are the keys).
  // [short label, one-line description]. Gait scores follow the Bristol scale used in the report.
  parts: {
    'F6. Lameness GS1':          ['Gait score 1', 'a slight walking defect, hard to pin down'],
    'F6. Lameness GS2':          ['Gait score 2', 'a definite, identifiable defect that does not yet limit the bird’s movement'],
    'F6. Lameness GS3':          ['Gait score 3', 'an obvious defect that affects the bird’s ability to move'],
    'F6. Lameness GS4':          ['Gait score 4', 'a severe defect; the bird walks only when driven, a few steps before sitting down'],
    'F6. Lameness GS4 Culled':   ['Gait score 4, culled', 'as above, then killed on the farm; includes the hunger and thirst of a bird that cannot reach feed and water'],
    'F6. Lameness GS5':          ['Gait score 5', 'unable to walk at all'],
    'F6. Lameness GS5 Culled':   ['Gait score 5, culled', 'unable to walk, then killed on the farm; includes the hunger and thirst before that'],
    'F6. Ascites (non-fatal)':   ['Non-fatal', 'pulmonary hypertension with a swollen abdomen and laboured breathing; the bird survives to slaughter'],
    'F6. Ascites (fatal)':       ['Fatal', 'the bird dies of heart failure before slaughter, after days of symptoms'],
    'F6. Sudden Death':          ['Sudden death', 'acute heart failure, over in seconds'],
    'F6. Heat Stress Wk3':       ['Week 3 of life', 'as the bird grows, it makes more heat and can shed less of it'],
    'F6. Heat Stress Wk 4':      ['Week 4 of life', ''],
    'F6. Heat Stress Wk5':       ['Week 5 of life', ''],
    'F6. Heat Stress Wk 6':      ['Week 6 of life', 'the heaviest birds, in the most crowded sheds'],
    'F6. Heat Stress Wk 7':      ['Week 7 of life', 'slower-growing birds only'],
    'F6. Heat Stress Wk 8':      ['Week 8 of life', 'slower-growing birds only'],
    'F6. Foraging & Exploration Deprivation': ['Frustration of foraging and exploring', ''],
    'F6. Perching Deprivation':  ['Frustration of perching and roosting', ''],
    'F6. Dustbathing Deprivation': ['Frustration of dustbathing', ''],
    'F6. Breeder Hunger':        ['Chronic hunger', 'from feed restriction over the parent hen’s life'],
    'F6. Breeder Acute Peritonitis (fatal)': ['Acute peritonitis, fatal', 'septic infection of the abdomen; the hen dies within days'],
    'F6. Breeder Chronic Peritonitis': ['Chronic peritonitis', 'yolk clumps in the abdomen; “a life of discomfort”'],
    // Slaughter (from the project's stunning Pain-Tracks; the calculator uses the low-voltage, high-frequency electrical waterbath scenario)
    'Stun: Shackling':                 ['Shackling', 'hung upside down by the legs on a moving line, for 20 to 90 seconds; leg pain, fear, and some wing fractures'],
    'Stun: Pre-stun shocks':           ['Pre-stun shocks', 'wings touch the electrified water before the head does'],
    'Stun: Electrical stun':           ['Electrical stun', 'the moment of the shock, for the birds it does render unconscious'],
    'Stun: Failed stun':               ['Failed stun', 'paralysed by the current but still conscious: the report assumes 5 to 70% of birds where stunning parameters are unregulated'],
    'Stun: Neck cut while conscious':  ['Neck cut while conscious', 'the automatic blade cuts the neck of birds that were not stunned or came round'],
    'Stun: Scalded alive':             ['Scalded alive', 'birds still conscious on entering the scalding tank: 0.01 to 6% where unregulated, 5.4% in one Dutch study'],
    'Stun: Gas stun':                  ['Gas stun', 'controlled-atmosphere stunning with CO2, which is aversive to breathe before it causes unconsciousness']
  },

  // What each pain intensity means (Welfare Footprint Project definitions, shortened).
  intensities: {
    annoying:     'unpleasant, but does not disrupt normal activity',
    hurtful:      'hard to ignore; the bird is aware of it most of the time',
    disabling:    'continuously distressing; no enjoyment is possible',
    excruciating: 'intolerable even for seconds'
  },

  // The two kinds of chicken.
  systems: {
    conventional: { label: 'Conventional (fast-growing)', farm: 'on a factory farm' },
    reformed:     { label: 'Higher-welfare (slower-growing)', farm: 'on a higher-welfare farm' }
  },

  // ---- Calculator page ----------------------------------------------------
  plate: {
    title: 'What’s the welfare footprint of chicken?',
    typeHeading: 'Type an amount',
    // Shown at the bottom of the page.
    caveat: 'This assumes a conventional fast-growing bird, which is what nearly all chicken sold is, including most free-range and organic chicken in the US. ' +
            'A slower-growing bird raised to Better Chicken Commitment standards would carry about two-thirds less disabling pain; the Equation page shows that comparison.',
    typeHint: 'Count the chicken meat only, not the bun, breading or bones. A restaurant chicken breast is about 6 oz; a deck-of-cards portion is about 3 oz.',
    // The "typical American" preset under the amount box. {oz} and {g} are the cooked chicken per week; {lb} the ERS figure.
    presetLabel: 'Or take a typical American’s week: {oz} oz of cooked chicken',
    presetNote: 'USDA ERS food availability, 2021: {lb} lb of boneless chicken per person a year, before plate waste, so a slight overestimate of what is eaten.',
    presetSource: 'https://www.ers.usda.gov/data-products/charts-of-note/chart-detail?chartId=105929',
    presetItem: ' (a typical American’s week)',
    pickHeading: 'Or pick a common item',
    pickHint: 'Approximate cooked-meat weights.',
    // Shown under an item's name when you hover over it. {oz} is the ounces of cooked chicken.
    itemAmount: '{oz} oz of chicken',
    photoCredits: 'Photo credits',
    // {days} {farm} {fraction} {lifetime} {grams}
    // {amount} is the entered amount ("6 oz" or "170 g"); {item} is the item note below, or empty when an amount was typed.
    headline: 'To create <b>{amount}</b>{item} of meat, a chicken had to live <b>{days} days</b> {farm}.',
    // Inserted after the amount when a common item was picked. {a} is "a " or "" (for names that start with a number or "Half"); {name} is the item's name.
    headlineItem: ' (the amount in {a}{name})',
    // Item names that keep their capital letter mid-sentence. Any other name has its first letter lower-cased in the headline.
    brands: ['Chick-fil-A', 'McDonald’s', 'Popeyes', 'KFC', 'Chipotle'],
    headlineSmall: 'That is {fraction} of one bird’s {lifetime}-day life, from {grams} g of cooked meat (likely {daysLo} to {daysHi} days, depending on the bird’s yield and whether skin counts as meat).',
    causesHeading: 'This resulted in:',
    causeLine: 'of {harm}',                         // after the hours, e.g. "52 hours of lameness"
    rangeLine: 'likely {lo} to {hi}',               // the grey 90% range
    // {what} {perBird} {fraction}
    // Heading of the table of kinds inside a harm's dropdown (only shown when the harm has more than one kind).
    partsHeading: 'Made up of:',
    // Link at the end of each harm's description, to that harm's page.
    causeLink: 'Read what the report says about it.',
    causeDetail: '{what}. An average bird in this system spends <b>{perBird}</b> in this pain over its life; this serving is {fraction} of a bird, so it carries that share.',
    totalLine: 'of harm in total, counting each harm separately',
    levelsHeading: 'Researchers think this resulted in the chicken feeling:',
    // Line under the intensity table.
    levelsNote: 'Counting each harm separately, so hours can overlap when a bird suffers two harms at once.',
    // {level} {definition}
    levelLine: 'of <b>{level}</b> pain, which is “{definition}”',
    footnote: 'Hours are an average bird’s time in pain over its life (Welfare Footprint Project, waking hours only), scaled to this serving. ' +
              'Harms that happen at the same time are each counted, so the totals are harm-hours rather than clock hours; this matters most for the annoying and hurtful rows. ' +
              'The grey figures are 90% ranges. The causes and the intensities are the same hours split two ways. Sources and the full working are on the Methodology page.',
    // ---- The "over the long run" block at the bottom of the results ----
    longrun: {
      heading: 'Over the long run',
      // {times} and {years} become the input box and the dropdown.
      question: 'How often do you eat this much? {times} times a week, for {years} years.',
      yearsOptions: [1, 5, 10, 20, 30, 40, 50],
      defaultTimes: 2,
      defaultYears: 10,
      // {times} {years} {meals} {chickens} {chickensLo} {chickensHi} {perYear} (lb a year) {perYearKg}
      headline: 'That’s <b>{meals} meals</b>, or <b>{chickens} chickens</b>, over {years} years.',
      // Used instead when the typical-American preset is on (the amount is a week's worth, not a meal).
      headlinePreset: 'That’s <b>{chickens} chickens</b> over {years} years.',
      headlineSmall: 'About {perYear} lb of chicken a year (likely {chickensLo} to {chickensHi} chickens). Between them, those chickens spent:',
      causesHeading: 'In total:',
      levelsHeading: 'Which researchers think they felt as:',
      levelsNote: 'Counting each harm separately, so hours can overlap when a bird suffers two harms at once.'
    },
    // Common items: [name, grams of cooked chicken meat, note, photo file]. Add, remove or reorder freely.
    // Photo files live in docs/img/; their credits are in docs/photos.js.
    items: [
      ['Chick-fil-A Chicken Sandwich', 100, 'one breaded breast filet', 'img/chick-fil-a-sandwich.webp'],
      ['Chick-fil-A Nuggets, 8 count', 95, '', 'img/chick-fil-a-nuggets.webp'],
      ['McDonald’s McNuggets, 10 piece', 80, 'about half of a nugget is chicken', 'img/mcnuggets.webp'],
      ['Popeyes Chicken Sandwich', 110, '', 'img/popeyes-sandwich.webp'],
      ['KFC 2-piece, thigh and drumstick', 140, 'meat only', 'img/kfc-2-piece.webp'],
      ['Chipotle chicken bowl or burrito', 113, 'a 4 oz scoop', 'img/chipotle-bowl.webp'],
      ['Grilled chicken breast, restaurant', 170, '6 oz', 'img/grilled-chicken-breast.webp'],
      ['Half a rotisserie chicken', 280, 'meat only', 'img/rotisserie-chicken.webp'],
      ['6 buffalo wings', 90, 'meat only', 'img/buffalo-wings.webp'],
      ['Chicken Caesar salad', 85, '', 'img/chicken-caesar-salad.webp'],
      ['Bowl of chicken noodle soup', 25, '', 'img/chicken-noodle-soup.webp']
    ]
  },

  // ---- About page ---------------------------------------------------------
  about: {
    title: 'About',
    // One entry per paragraph. HTML is allowed (links, <b>, <i>).
    paragraphs: [
      'This site puts a number on the animal welfare cost of eating chicken. Type in an amount of chicken, or pick a common item, and it works out how much of one chicken’s life that meat represents and how many hours of pain that share of a life carried.',
      'The pain figures come from the Welfare Footprint Project, a research group that estimates how long farmed animals spend in pain of different intensities, cause by cause. Their report <a href="https://welfarefootprint.org/broilers"><i>Quantifying Pain in Broiler Chickens</i></a> is the source of every hour on this site, including the ranges. The <a href="harms.html">Harms</a> page shows their definitions and the pages of the report behind each harm.',
      'The weights, yields and lifespans that turn a serving into a share of a chicken come from the US Department of Agriculture and university extension sources. The <a href="methodology.html">Methodology</a> page lays the whole calculation out step by step, with every number tagged with its source.',
      'The calculator assumes a conventional fast-growing chicken, which is what nearly all chicken sold is. Slower-growing birds raised to higher welfare standards carry less pain; the Methodology page lets you compare the two.',
      'This is an independent project and is not affiliated with the Welfare Footprint Project. The code and data are open on <a href="https://github.com/RobPaine1/chicken-welfare-impact">GitHub</a>, where corrections and suggestions are welcome.'
    ]
  },

  // ---- Harms page ---------------------------------------------------------
  harmsPage: {
    title: 'Harms',
    // {book} becomes the report's citation with a link.
    intro: 'The harms counted by the calculator. Each opens the Welfare Footprint Project’s description of that harm and every page of {book} that mentions it.',
    pagesLink: 'See the {n} pages of the report that mention {name}',
    // Shown at the top of each harm's own page. {name} is the harm, {book} the citation.
    pageIntro: 'Every page of {book} that mentions {name}:',
    chapterLabel: 'Chapter {n}. {title}',
    pageLabel: 'Chapter {n}, page {p}',
    // Photo for each harm (in docs/img/harms/; credits in docs/photos.js) and its caption. Remove a line to drop the photo.
    photos: {
      'Lameness':                 ['img/harms/lameness.jpg', 'A broiler with deformed legs lying in a shed.'],
      'Ascites':                  ['img/harms/ascites.jpg', 'A hen with ascites: fluid has swollen the abdomen. This case followed an egg problem rather than heart failure, but the fluid build-up looks the same.'],
      'Sudden death syndrome':    ['img/harms/sudden-death-syndrome.jpg', 'A broiler chick found dead in a shed one week after placement.'],
      'Heat stress':              ['img/harms/heat-stress.jpg', 'A crowded broiler shed. At these densities the birds’ own body heat is hard to shed.'],
      'No foraging or exploring': ['img/harms/no-foraging-or-exploring.jpg', 'A rooster pecking at the ground: the foraging that a barren shed floor does not allow.'],
      'No perching':              ['img/harms/no-perching.jpg', 'Hens roosting on a perch, the raised, safe spot chickens seek at night.'],
      'No dustbathing':           ['img/harms/no-dustbathing.jpg', 'A hen dustbathing in dry, loose earth.'],
      'Breeder hen hunger':       ['img/harms/breeder-hen-hunger.jpg', 'Inside a broiler breeder farm in Poland.'],
      'Breeder hen peritonitis':  ['img/harms/breeder-hen-peritonitis.jpg', 'A laying hen with an E. coli infection, the usual cause of egg peritonitis, hunched in the “penguin” stance the report describes.'],
      'Stunning and slaughter':   ['img/harms/stunning-and-slaughter.jpg', 'Hens hung by the legs in shackles on a slaughter line, the step before an electrical water-bath stun.']
    },
    // Credit line under a photo. {author} {license} become the photographer and licence, linked.
    photoCredit: 'Photo: {author}, {license}, via Wikimedia Commons.',
    // Short notes shown under a harm's name on the Harms page.
    notes: {
      'Breeder hen hunger': 'The parent hens of meat chickens. The calculator spreads each hen’s pain over the chicks she produces.',
      'Breeder hen peritonitis': 'The parent hens of meat chickens. The calculator spreads each hen’s pain over the chicks she produces.',
      'Stunning and slaughter': 'Counted by the calculator using the report’s low-voltage, high-frequency electrical waterbath scenario, which the report expects to prevail where stunning is unregulated, including the United States. The higher-welfare comparison on the Methodology page uses properly run CO2 stunning instead.'
    },
    // Further reading on each harm's page: [title, url, one-line note]. Add, remove or reorder freely.
    linksHeading: 'Further reading',
    links: {
      'Lameness': [
        ['Knowles et al. 2008, Leg disorders in broiler chickens: prevalence, risk factors and prevention', 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0001545', 'PLOS ONE; the large UK survey of gait scores in commercial flocks (27.6% of birds at gait score 3 or worse).'],
        ['Granquist et al. 2019, Lameness and its relationship with health and production measures in broiler chickens', 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6749567/', 'Open access, in the journal Animal.'],
        ['Caplen et al. 2012, Kinematic analysis quantifies gait abnormalities associated with lameness in broiler chickens', 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0040800', 'PLOS ONE; how lame birds change the way they walk.'],
        ['EFSA 2023, Welfare of broilers on farm', 'https://doi.org/10.2903/j.efsa.2023.7788', 'The European food safety authority’s scientific opinion; lameness, stocking density and litter.']
      ],
      'Ascites': [
        ['Wideman et al. 2013, Pulmonary arterial hypertension (ascites syndrome) in broilers: a review', 'https://pubmed.ncbi.nlm.nih.gov/23243232/', 'Poultry Science; the standard review of the condition.'],
        ['The Poultry Site: Pulmonary arterial hypertension (ascites syndrome) in broilers', 'https://www.thepoultrysite.com/articles/pulmonary-arterial-hypertension-ascites-syndrome-in-broilers-a-review', 'A readable summary of the review above.']
      ],
      'Sudden death syndrome': [
        ['MSD Veterinary Manual: Sudden death syndrome of broiler chickens', 'https://www.msdvetmanual.com/poultry/sudden-death-syndrome-of-broiler-chickens/sudden-death-syndrome-of-broiler-chickens', 'Signs, findings at post-mortem and links to growth rate.'],
        ['Poultry Extension: Sudden death syndrome in poultry', 'https://poultry.extension.org/articles/poultry-health/common-poultry-diseases/sudden-death-syndrome-in-poultry/', 'US university extension summary.'],
        ['Siddiqui et al. 2009, Pathological studies of “sudden death syndrome” in broiler chickens', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1789498/', 'Open access.']
      ],
      'Heat stress': [
        ['University of Florida IFAS: Heat stress management in broilers', 'https://ask.ifas.ufl.edu/publication/VM019', 'Extension guide; what heat stress does to the bird and how sheds try to manage it.'],
        ['Rehman et al. 2020, Strategies to combat heat stress in broiler chickens', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7356496/', 'Open-access review of the physiology.'],
        ['Kim et al. 2022, Meta-analysis and systematic review of the thermal stress response in chickens', 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8832064/', 'Open access.']
      ],
      'No foraging or exploring': [
        ['Anderson et al. 2021, Environmental complexity positively impacts affective states of broiler chickens', 'https://www.nature.com/articles/s41598-021-95280-4', 'Scientific Reports; birds in enriched pens were measurably more optimistic.'],
        ['Baxter et al. 2021, Behaviour and animal welfare indicators of broiler chickens housed in an enriched environment', 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0256963', 'PLOS ONE.'],
        ['EFSA 2023, Welfare of broilers on farm', 'https://doi.org/10.2903/j.efsa.2023.7788', 'Recommends friable litter so birds can forage and explore.']
      ],
      'No perching': [
        ['Anderson et al. 2023, Environmental complexity and reduced stocking density promote positive behavioral outcomes in broiler chickens', 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10339985/', 'Open access; perch use rises when there is room.'],
        ['Baxter et al. 2021, Behaviour and animal welfare indicators of broiler chickens housed in an enriched environment', 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0256963', 'PLOS ONE.'],
        ['EFSA 2023, Welfare of broilers on farm', 'https://doi.org/10.2903/j.efsa.2023.7788', 'Recommends elevated platforms for resting and leg health.']
      ],
      'No dustbathing': [
        ['Anderson et al. 2021, Environmental complexity positively impacts affective states of broiler chickens', 'https://www.nature.com/articles/s41598-021-95280-4', 'Scientific Reports; dustbathing among the behaviours studied.'],
        ['Baxter et al. 2021, Behaviour and animal welfare indicators of broiler chickens housed in an enriched environment', 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0256963', 'PLOS ONE.']
      ],
      'Breeder hen hunger': [
        ['Mench 2002, Broiler breeders: feed restriction and welfare', 'https://doi.org/10.1079/WPS20020035', 'World’s Poultry Science Journal; the classic review.'],
        ['Dixon et al. 2014, Food-restricted broiler breeder chickens cross a water barrier to forage in an area of wood shavings without food', 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0102322', 'PLOS ONE; how hard hungry breeders will work to forage.'],
        ['Arrazola et al. 2020, Effect of qualitative feed restriction in broiler breeder pullets on stress and clinical welfare indicators', 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7300207/', 'Open access; diluted diets do not remove the hunger.']
      ],
      'Breeder hen peritonitis': [
        ['Merck Veterinary Manual: Egg peritonitis in poultry', 'https://www.merckvetmanual.com/poultry/disorders-of-the-reproductive-system-in-poultry/egg-peritonitis-in-poultry', 'What the condition is and why treatment rarely works.'],
        ['Landman et al. 2013, Reproduction of the Escherichia coli peritonitis syndrome in laying hens', 'https://doi.org/10.1080/03079457.2013.775694', 'Avian Pathology.'],
        ['Poultry Science 2024, Characterization of Escherichia coli pathogenicity and drug resistance in yolk peritonitis', 'https://www.sciencedirect.com/science/article/pii/S0032579124003936', 'Open access.']
      ],
      'Stunning and slaughter': [
        ['EFSA 2019, Slaughter of animals: poultry', 'https://doi.org/10.2903/j.efsa.2019.5849', 'Scientific opinion on every stage from shackling to bleeding, with the welfare consequences of each.'],
        ['EFSA 2012, Electrical requirements for waterbath stunning equipment applicable for poultry', 'https://doi.org/10.2903/j.efsa.2012.2757', 'Why low-current settings fail to stun.'],
        ['EFSA 2013, Monitoring procedures at slaughterhouses for poultry', 'https://doi.org/10.2903/j.efsa.2013.3521', 'How to tell whether a bird is unconscious on the line.'],
        ['Wikipedia: Electrical water bath stunning', 'https://en.wikipedia.org/wiki/Electrical_water_bath_stunning', 'An overview with references.'],
        ['Bogosavljević-Bošković et al. 2021, The influence of broilers’ body weight on the efficiency of electrical stunning', 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8151686/', 'Open access; field data on stun failure.']
      ]
    },
    // General reading, listed at the bottom of the Harms page.
    generalHeading: 'Further reading on broiler welfare',
    generalLinks: [
      ['EFSA 2023, Welfare of broilers on farm (plain-language summary)', 'https://www.efsa.europa.eu/en/plain-language-summary/welfare-broilers-farm', 'The European food safety authority’s overview of the main welfare problems and what would fix them.'],
      ['Welfare Footprint Project: Broilers', 'https://welfarefootprint.org/broilers', 'The research group whose pain estimates this site uses.'],
      ['Rayner et al. 2024, An analysis of the welfare of fast-growing and slower-growing strains of broiler chicken', 'https://www.frontiersin.org/journals/animal-science/articles/10.3389/fanim.2024.1374609/full', 'Frontiers in Animal Science; what changes with slower-growing breeds.'],
      ['RSPCA: Better chicken', 'https://www.rspca.org.uk/getinvolved/campaign/betterchicken', 'The case for the Better Chicken Commitment standards.']
    ],
    // Quotes from the report that define each harm. Order here is the order on the page.
    definitions: {
      'Lameness': [
        { quote: 'Lameness, a clinical indicator of a collection of disorders that affect the ability of an individual to walk, is widely considered a major problem in the broiler industry and the primary welfare concern for broilers. It is defined as an impairment in the ability to walk normally as a result of injury, infection or deformity in one or more weight-bearing structures (e.g., skeleton, muscle, tendons, skin or nervous system in the legs and feet), and conformation.', cite: 'Chapter 2, page 1' },
        { quote: 'Lameness is a multifactorial condition heavily associated with fast growth rates. […] Because bone development is not as rapid as the rate of muscle deposition, disproportionate stress is placed on relatively immature bones and joints.', cite: 'Chapter 2, page 1' }
      ],
      'Ascites': [
        { quote: 'Ascites (the term used for the abnormal accumulation of fluid in the abdominal cavity) can cause prolonged suffering before becoming severe enough to result in death, which will often happen due to a combination of hypoxemia, congestive heart failure, starvation and respiratory distress caused by pulmonary edema and compression of the air sacs in the abdomen by the accumulation of fluid in the abdominal cavity. Live birds experiencing ascites present with visibly swollen abdomens and apparent respiratory distress.', cite: 'Chapter 3, page 2' },
        { quote: 'Two conditions commonly present in commercial flocks, pulmonary hypertension (leading to ascites) and sudden death syndrome (SDS), are a result of cardiorespiratory insufficiency from intense selection for rapid growth.', cite: 'Chapter 3, page 1' }
      ],
      'Sudden death syndrome': [
        { quote: 'Different from pulmonary hypertension and ascites, sudden death syndrome (SDS) seems to occur without warning, with seemingly healthy birds suddenly flipping over and dying. This condition is believed to be caused by a lack of oxygen to the myocardium, leading to acute heart failure. […] Prior to death, birds are observed violently flapping their wings, extending their neck, emitting a vocalization (“squawk”), and collapsing.', cite: 'Chapter 3, page 2' }
      ],
      'Heat stress': [
        { quote: 'Heat stress occurs when the amount of heat produced by an animal surpasses its capacity to dissipate it to the environment, as a result of both environmental factors (e.g. high temperatures, humidity, poor ventilation, stocking density) and the animal’s traits (e.g. body size, body surfaces’ sizes, their thermal resistance, metabolic rate, coping mechanisms).', cite: 'Chapter 4, page 2' },
        { quote: 'One of the first visible signs of heat stress is panting. […] Other behavioral changes commonly associated with heat stress include wing spreading, squatting close to the ground, drinking, sleeping, dozing, and sitting. Birds will also reduce the amount of time spent eating, standing, and walking.', cite: 'Chapter 4, page 2' }
      ],
      'No foraging or exploring': [
        { quote: 'In chickens, foraging encompasses two distinct behaviors, often performed in an alternating sequence: ground pecking (rapid, downward movements of the beak towards the litter or other substrates) and ground scratching (backward kicks at the substrate using one leg).', cite: 'Chapter 5, page 3' },
        { quote: 'Despite over 8,000 years of domestication, modern chickens still retain a similar behavioral repertoire as that of their wild ancestors, the red junglefowl. Given the opportunity, they will still spend a substantial fraction of their behavioral time budget foraging and exploring the environment, as well as perching and dustbathing. Still, in modern commercial broiler production the expression of many of these drives is greatly constrained.', cite: 'Chapter 5, page 1' },
        { quote: 'In this Chapter, we assume that the frustration of motivated behaviors may trigger affective (emotional) experiences of a negative valence, which we refer to as ‘psychological pain’.', cite: 'Chapter 5, page 2' }
      ],
      'No perching': [
        { quote: 'Although perches and raised platforms are not typically available in conventional broiler farms, when available, broilers will use them. […] Given the adaptive antipredatory function of perching, as well as evidence to suggest that broilers raised without the opportunity to perch are more fearful, stressed and aggressive, we tentatively hypothesize that the inability to perch or roost is aversive for broilers.', cite: 'Chapter 5, page 9' },
        { quote: 'We tentatively assume that psychological pain associated with the inability to perch and roost will be most prominent: 1) when searching for a safe, elevated site, which we estimate to last approximately 30-60 minutes and 2) during dark hours.', cite: 'Chapter 5, page 10' }
      ],
      'No dustbathing': [
        { quote: 'Dustbathing is common in poultry and other bird species, consisting of a sequence of coordinated movements. Initially, the bird squats in the substrate and uses the wings to throw dust through the feathers, next rising and shaking off the dust. […] Typically, chickens will dustbathe about once every other day, often for 20 to 35 minutes at a time. From a functional perspective, dustbathing has been associated with the removal of surplus stale lipids from the feathers (improving the insulation capacity of the feathers), dandruff and possibly ectoparasites.', cite: 'Chapter 5, page 12' },
        { quote: 'Low levels of dustbathing in broilers may also reflect a lack of a suitable substrate. Under commercial conditions, litter tends to become very wet and compact across the production cycle, limiting its attractiveness for dustbathing.', cite: 'Chapter 5, page 13' }
      ],
      'Breeder hen hunger': [
        { quote: 'While obviously sharing the same genetics for fast-growth and high feed conversion, breeders must live long enough to reach adulthood and reproduce. Yet, the odds that a modern breeder becomes obese, severely ill or dies is very high over this longer lifespan. […] The traditional workaround chosen by the industry to improve the reproductive performance of breeders and increase their survival odds has been the adoption of severe levels of feed restriction to slow down growth and prevent obesity.', cite: 'Chapter 6, pages 1–2' },
        { quote: 'We refer to this motivation as ‘hunger’, an aversive (negatively valenced) state that signals the need for food. Like with other forms of pain, hunger signaling must be loud enough to drive attention away from other tasks and stimuli, imposing a new action priority to prevent survival from being compromised.', cite: 'Chapter 6, pages 6–7' }
      ],
      'Breeder hen peritonitis': [
        { quote: 'Egg peritonitis syndrome (EGS, a painful and often fatal reproductive condition) is the main production disease and leading cause of mortality in egg-laying hens. EGS is a disease characterized by the inflammation of the oviduct and abdominal cavity, often triggered by the presence of yolk. […] In chronic cases, the yolk form clumps in the abdominal cavity, leading to a life of discomfort.', cite: 'Chapter 6, page 12' }
      ],
      'Stunning and slaughter': [
        { quote: 'Although the aim of a stunning system is to achieve a 100% effective stun, the most effective electrical parameters can achieve an effectiveness of up to 96% as measured using EEG. Therefore, we assume that 4-10% of chickens will be conscious before bleeding should an electrical waterbath system be ideally implemented. […] We tentatively estimate that these figures may typically vary from 5 to 70% of birds in the United States and other countries lacking regulation on stunning parameters.', cite: 'Chapter 8, page 7' },
        { quote: 'We also estimate that 0.01% to 6% of birds may reach the scalding tank still conscious in countries lacking regulation on stunning parameters. The upper limit is based on an independent study that measured this parameter for flocks from 10 farms in a Dutch abattoir before European regulations on stunning were implemented, and which reports 5.4 ± 1.4% of birds entering the scalding tank still conscious.', cite: 'Chapter 8, page 8' },
        { quote: 'Based only on official records in federally inspected slaughter plants in the United States, over 500 thousand chickens were scalded alive in that country in 2019 (though this figure is likely underestimated).', cite: 'Chapter 8, page 6' },
        { quote: 'Recognition that the pain endured during slaughter should be alleviated has become the main driver for the implementation of slaughter methods that include an initial stunning stage to render the animal unconscious and insensible to pain — ideally in an immediate and painless way — until the time of death. […] In this chapter we quantify the welfare impacts of existing and potential policies on the stunning of poultry prior to slaughter.', cite: 'Chapter 8, page 2' }
      ]
    }
  },

  // ---- Equation page ------------------------------------------------------
  equation: {
    title: 'Methodology',
    servingBefore: 'One serving is',
    servingAfter: 'oz of cooked chicken.',
    chickenLabel: 'Chicken:',
    harmLabel: 'Harm:',
    allHarms: 'All harms',
    intro: 'Words on the left, numbers on the right. Click a row marked &#9662; to see how it is worked out, step by step.',
    inWords: 'In words',
    withNumbers: 'With numbers',
    intensityHeading: 'The same hours by intensity, all harms: mean, then the project’s 90% interval in brackets',
    byCauseHeading: 'By cause. Click one to focus the equation on it.',
    notesSummary: 'Notes and sources',
    // {retrieved}
    notesHarms: 'Hours of pain per bird come from the Welfare Footprint Project’s Pain-Track for broilers, retrieved {retrieved}. ' +
                'For each cause the project combined how many birds are affected, how long it lasts and how intense it is, then summed over the bird’s life. ' +
                'Only hours awake are counted, so no separate allowance for sleep is needed. Lifetime is not a separate multiplier: it is the window over which the hours accumulate. ' +
                'Harms that happen at the same time are each counted, so totals are harm-hours rather than clock hours.',
    notesBreeders: 'The two breeder-hen lines are part of the project’s own total: the parent hens’ pain is spread over the chicks each produces, so a broiler carries a small share of it.',
    notesOverlap: 'The hours are harm-hours, like person-hours: a bird that is lame and heat-stressed for the same hour is counted for two hours, one under each harm. The intensity totals are the same hours sorted by severity, so they overlap in the same way. That is why the total for a 42-day bird, about 709 hours, can exceed the roughly 630 hours it is awake. The project builds each harm’s estimate from evidence specific to that harm and then assumes harms neither cancel nor amplify one another; it lists that assumption as a research gap. A single harm on its own, such as lameness, is the cleanest number to quote, since it cannot overlap with itself.',
    notesIntensities: 'The intensities',
    notesUncertainty: 'The project varies every input over its plausible range and reports a mean and a 90% interval (5th to 95th percentile); no median or 95% interval is published. ' +
                      'The intervals on the by-intensity totals are the project’s own, from its Tableau workbook. The intervals on individual causes are derived: each cause’s standard deviation from the project’s per-harm figures, scaled so the same rule reproduces the published interval for the total. Treat those as approximate. ' +
                      'The interval on the all-harms total combines the four intensity intervals in quadrature. ' +
                      'The weight side carries its own range: cooking yield 0.65–0.75 (USDA SR28 paired raw and roasted weights: 0.65 for a whole bird with skin, 0.74 for meat only; the 0.75 used is the high end, which is the conservative end, since a lower yield means more raw meat behind each serving), dressing percentage 72–75% (Wisconsin Extension) and edible share from 56% (skin not counted) to 68% (meat and skin), both USDA refuse figures, so the raw meat one bird yields is 1,008–1,275 g around the 1,250 g used. These are bounding ranges rather than 90% intervals. ' +
                      'The interval on the final number combines the weight-side and harm-side ranges as independent relative errors. Every interval on this page should be read as approximate.',
    notesBird: 'The conventional bird is the project’s scenario bird: a fast-growing breed reaching 2.5 kg at 42 days, the bird every hour of pain above is estimated for, so the meat per bird is its meat too. The average U.S. broiler is heavier and older, 2.97 kg (USDA NASS 2024) at about 47 days (National Chicken Council); a heavier bird gives more meat per life but also lives longer, and the project’s pain figures are not defined for it. For American readers: the extra meat would pull each serving’s figures down by about 6% if pain accrued evenly over the extra days, while the extra weight and age push them back up, since lameness, heat stress and ascites all grow with size and time. The project chose its growth rate as intermediate between the US and EU averages, so its bird is a fair stand-in for both.',
    notesBasis: 'SR28 also says that one pound of ready-to-cook chicken yields 276 g of raw meat and skin, which is 61%, not the 68% the refuse figure gives. The gap is the neck and giblets, which come with that pound but are not carcass meat: Wisconsin Extension puts them at about 7% of live weight, and taking them out of the pound brings the figure to about 67%. The dressing percentage used here is defined without them (University of Maine Extension: hot carcass weight ÷ live weight, minus giblets and neck), so 68% is the right share to apply to it and the two USDA figures agree.',
    notesReformed: 'is the project’s reformed scenario: a slower-growing breed reaching 2.5 kg at 56 days under Better Chicken Commitment conditions. The dressing and edible-share percentages are assumed unchanged.',
    notesExcluded: 'pain during catching and transport, and diseases the project did not model. The numbers are conservative. Slaughter is counted using the project’s stunning Pain-Tracks: the low-voltage, high-frequency electrical waterbath scenario for conventional birds (the report expects it to prevail where stunning is unregulated) and properly run CO2 stunning for the reformed scenario. Those intervals are plain independent sums, as no published totals exist for them.',
    notesSources: 'by the tag shown as a subscript in the equations.'
  }
};
