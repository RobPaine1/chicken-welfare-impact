// All the words on both pages live here. Edit freely; nothing in this file affects the numbers.
//
// Curly-brace placeholders such as {days} are filled in by the page. Keep them as they are,
// but you can move them around or drop them. HTML tags like <b> are allowed.
var TEXT = {

  // ---- Shared -------------------------------------------------------------
  nav: { equation: 'Equation', plate: 'Plate' },

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
    'Breeder hen peritonitis': 'infection of the abdomen in the parent hens, spread over the chicks each produces'
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

  // ---- Plate page ---------------------------------------------------------
  plate: {
    title: 'Select an amount of chicken',
    subtitle: 'Cooked meat only, not counting bone, breading or sauce.',
    chickenLabel: 'Chicken:',
    typeHeading: 'Type an amount',
    typeHint: 'A restaurant chicken breast is about 6 oz. A deck-of-cards portion is about 3 oz.',
    pickHeading: 'Or pick a common item',
    pickHint: 'Approximate cooked-meat weights.',
    // {days} {farm} {fraction} {lifetime} {grams}
    headline: 'A chicken had to live <b>{days} days</b> {farm} to create this chicken.',
    headlineSmall: 'That is {fraction} of one bird’s {lifetime}-day life, from {grams} g of cooked meat.',
    causesHeading: 'This resulted in:',
    causeLine: 'of {harm}',                         // after the hours, e.g. "52 hours of lameness"
    rangeLine: 'likely {lo} to {hi}',               // the grey 90% range
    // {what} {perBird} {fraction}
    causeDetail: '{what}. An average bird in this system spends <b>{perBird}</b> in this pain over its life; this serving is {fraction} of a bird, so it carries that share.',
    totalLine: 'of harm in total, counting each harm separately',
    levelsHeading: 'Researchers think this resulted in the chicken feeling:',
    // {level} {definition}
    levelLine: 'of <b>{level}</b> pain, which is “{definition}”',
    footnote: 'Hours are an average bird’s time in pain over its life (Welfare Footprint Project, waking hours only), scaled to this serving. ' +
              'Harms that happen at the same time are each counted, so the totals are harm-hours rather than clock hours; this matters most for the annoying and hurtful rows. ' +
              'The grey figures are 90% ranges. The causes and the intensities are the same hours split two ways. Sources and the full working are on the Equation page.',
    // Common items: [name, grams of cooked chicken meat, note]. Add, remove or reorder freely.
    items: [
      ['Chick-fil-A Chicken Sandwich', 100, 'one breaded breast filet'],
      ['Chick-fil-A Nuggets, 8 count', 95, ''],
      ['McDonald’s McNuggets, 10 piece', 80, 'about half of a nugget is chicken'],
      ['Popeyes Chicken Sandwich', 110, ''],
      ['KFC 2-piece, thigh and drumstick', 140, 'meat only'],
      ['Chipotle chicken bowl or burrito', 113, 'a 4 oz scoop'],
      ['Grilled chicken breast, restaurant', 170, '6 oz'],
      ['Half a rotisserie chicken', 280, 'meat only'],
      ['6 buffalo wings', 90, 'meat only'],
      ['Chicken Caesar salad', 85, ''],
      ['Bowl of chicken noodle soup', 25, '']
    ]
  },

  // ---- Equation page ------------------------------------------------------
  equation: {
    title: 'Chicken welfare calculator',
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
    notesIntensities: 'The intensities',
    notesUncertainty: 'The project varies every input over its plausible range and reports a mean and a 90% interval (5th to 95th percentile); no median or 95% interval is published. ' +
                      'The intervals on the by-intensity totals are the project’s own, from its Tableau workbook. The intervals on individual causes are derived: each cause’s standard deviation from the project’s per-harm figures, scaled so the same rule reproduces the published interval for the total. Treat those as approximate. ' +
                      'The interval on the all-harms total combines the four intensity intervals in quadrature. ' +
                      'The interval shown on the final number is the harm interval multiplied by the serving’s fraction of a chicken; that fraction has no published interval of its own, and its yields and weights are industry averages good to about ±10%.',
    notesReformed: 'is the project’s reformed scenario: a slower-growing breed reaching 2.5 kg at 56 days under Better Chicken Commitment conditions. The dressing and edible-share percentages are assumed unchanged.',
    notesExcluded: 'pain during transport and slaughter, and diseases the project did not model. The numbers are conservative.',
    notesSources: 'by the tag shown as a subscript in the equations.'
  }
};
