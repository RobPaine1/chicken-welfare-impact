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

  // ---- Calculator page ----------------------------------------------------
  plate: {
    title: 'Whats the welfare footprint of chicken?',
    typeHeading: 'Type an amount',
    // Shown at the bottom of the page.
    caveat: 'This assumes a conventional fast-growing bird, which is what nearly all chicken sold is, including most free-range and organic chicken in the US. ' +
            'A slower-growing bird raised to Better Chicken Commitment standards would carry about two-thirds less disabling pain; the Equation page shows that comparison.',
    typeHint: 'Count the chicken meat only, not the bun, breading or bones. A restaurant chicken breast is about 6 oz; a deck-of-cards portion is about 3 oz.',
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
    // Link at the end of each harm's description, to that harm's page.
    causeLink: 'Read what the report says about it.',
    causeDetail: '{what}. An average bird in this system spends <b>{perBird}</b> in this pain over its life; this serving is {fraction} of a bird, so it carries that share.',
    totalLine: 'of harm in total, counting each harm separately',
    levelsHeading: 'Researchers think this resulted in the chicken feeling:',
    // {level} {definition}
    levelLine: 'of <b>{level}</b> pain, which is “{definition}”',
    footnote: 'Hours are an average bird’s time in pain over its life (Welfare Footprint Project, waking hours only), scaled to this serving. ' +
              'Harms that happen at the same time are each counted, so the totals are harm-hours rather than clock hours; this matters most for the annoying and hurtful rows. ' +
              'The grey figures are 90% ranges. The causes and the intensities are the same hours split two ways. Sources and the full working are on the Equation page.',
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
      headlineSmall: 'About {perYear} lb of chicken a year (likely {chickensLo} to {chickensHi} chickens). Between them, those chickens spent:',
      causesHeading: 'In total:',
      levelsHeading: 'Which researchers think they felt as:'
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
    intro: 'The harms counted by the calculator, as the Welfare Footprint Project describes them in {book}. ' +
           'Each quote is from the report; each link opens every page of the report that mentions that harm.',
    pagesLink: 'See the {n} pages of the report that mention {name}',
    // Shown at the top of each harm's own page. {name} is the harm, {book} the citation.
    pageIntro: 'Pages of {book} that mention {name}.',
    chapterLabel: 'Chapter {n}. {title}',
    pageLabel: 'Chapter {n}, page {p}',
    // Short notes shown under a harm's name on the Harms page.
    notes: {
      'Breeder hen hunger': 'The parent hens of meat chickens. The calculator spreads each hen’s pain over the chicks she produces.',
      'Breeder hen peritonitis': 'The parent hens of meat chickens. The calculator spreads each hen’s pain over the chicks she produces.',
      'Stunning and slaughter': 'Not counted by the calculator, which covers life on the farm; the report treats slaughter in its own chapter.'
    },
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
    notesIntensities: 'The intensities',
    notesUncertainty: 'The project varies every input over its plausible range and reports a mean and a 90% interval (5th to 95th percentile); no median or 95% interval is published. ' +
                      'The intervals on the by-intensity totals are the project’s own, from its Tableau workbook. The intervals on individual causes are derived: each cause’s standard deviation from the project’s per-harm figures, scaled so the same rule reproduces the published interval for the total. Treat those as approximate. ' +
                      'The interval on the all-harms total combines the four intensity intervals in quadrature. ' +
                      'The weight side carries its own range: dressing percentage 72–75% (Wisconsin Extension) and edible share from 48% (meat only) to 68% (meat and skin), both USDA refuse figures, so the raw meat one bird yields is 1,027–1,515 g around the 1,485 g used. ' +
                      'The interval on the final number combines the weight-side and harm-side ranges as independent relative errors.',
    notesReformed: 'is the project’s reformed scenario: a slower-growing breed reaching 2.5 kg at 56 days under Better Chicken Commitment conditions. The dressing and edible-share percentages are assumed unchanged.',
    notesExcluded: 'pain during transport and slaughter, and diseases the project did not model. The numbers are conservative.',
    notesSources: 'by the tag shown as a subscript in the equations.'
  }
};
