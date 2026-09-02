/*
 * Meat welfare calculator — constants and formulas.
 *
 * Everything the page computes lives here so it can be read top-to-bottom
 * and unit-tested with `node --test tests/`.
 *
 * The chain for every meat is:
 *
 *   cooked meat eaten
 *     ÷ cooking yield                 → raw edible meat
 *     ÷ raw edible meat per animal    → animals used
 *     × days each animal lives        → days of animal life
 *     × hours of pain per animal      → hours of pain (chicken only, from the
 *                                       Welfare Footprint Project)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WelfareCalc = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var LB_TO_KG = 0.45359237;
  var OZ_TO_G = 28.349523125;

  // ---------------------------------------------------------------------
  // Sources. Every constant below points at one of these by key.
  // ---------------------------------------------------------------------
  var SOURCES = {
    nassPoultry: {
      title: 'USDA NASS, Poultry – Production and Value 2024 Summary (April 2025)',
      url: 'https://www.nass.usda.gov/Publications/Todays_Reports/reports/plva0425.pdf'
    },
    nassSlaughter: {
      title: 'USDA NASS, Livestock Slaughter 2024 Summary (April 2025)',
      url: 'https://esmis.nal.usda.gov/sites/default/release-files/r207tp32d/k930dv029/1v53mt52h/lsan0425.pdf'
    },
    ncc: {
      title: 'National Chicken Council, U.S. Broiler Performance (market age)',
      url: 'https://www.nationalchickencouncil.org/about-the-industry/statistics/u-s-broiler-performance/'
    },
    umainePoultry: {
      title: 'University of Maine Extension, Bulletin #2223: Understanding Poultry Yields',
      url: 'https://extension.umaine.edu/publications/2223e/'
    },
    wiscPoultry: {
      title: 'University of Wisconsin Extension, Bird Breakdown: Yields and Cuts of Poultry',
      url: 'https://livestock.extension.wisc.edu/articles/bird-breakdown-exploring-yields-and-cuts-of-poultry/'
    },
    cookingYields: {
      title: 'USDA ARS, Table of Cooking Yields for Meat and Poultry',
      url: 'https://www.ars.usda.gov/ARSUserFiles/80400525/data/retn/usda_cookingyields_meatpoultry.pdf'
    },
    turkeyDressing: {
      title: 'NACAA, 4-H/FFA Turkey Dressing Percentage Tool (77–81% typical)',
      url: 'https://www.nacaa.com/file.ashx?id=41ea8fc4-56d5-42ca-a72c-bf6f210383d8'
    },
    sdsuBeef: {
      title: 'South Dakota State University Extension, How Much Meat Can You Expect from a Fed Steer?',
      url: 'https://extension.sdstate.edu/how-much-meat-can-you-expect-fed-steer'
    },
    wiscPork: {
      title: 'University of Wisconsin Extension, How Much Meat Should a Hog Yield?',
      url: 'https://livestock.extension.wisc.edu/articles/how-much-meat-should-a-hog-yield/'
    },
    wfpBroilers: {
      title: 'Welfare Footprint Institute, Broilers: cumulative time in pain (conventional scenario)',
      url: 'https://welfarefootprint.org/broilers/'
    },
    wfpBook: {
      title: 'Schuck-Paim & Alonso (2022), Quantifying Pain in Broiler Chickens',
      url: 'https://www.amazon.com/Quantifying-Pain-Broiler-Chickens-Slower-Growing-ebook/dp/B09ZDWWD97'
    },
    painTrack: {
      title: 'Welfare Footprint Institute, Pain-Track for broilers (per-harm data)',
      url: 'https://pain-track.org/broilers'
    },
    wfpIntensities: {
      title: 'Welfare Footprint Institute, definitions of pain intensities',
      url: 'https://welfarefootprint.org/technical-definitions/pain-intensities/'
    },
    faunalytics: {
      title: 'Faunalytics, Animal Product Impact Scales (comparable lives-per-kg method)',
      url: 'https://faunalytics.org/animal-product-impact-scales/'
    }
  };

  // ---------------------------------------------------------------------
  // Shared constants
  // ---------------------------------------------------------------------
  // Meat loses roughly a quarter of its weight in cooking (water and fat).
  // People report what they eat as cooked weight, so we divide by this.
  var COOKING_YIELD = { value: 0.75, source: 'cookingYields',
    note: 'Most roasted, grilled or fried cuts retain 70–80% of raw weight.' };

  // ---------------------------------------------------------------------
  // Per-animal production figures. All U.S., calendar year 2024.
  // "liveLb"/"carcassLb" are national totals; per-animal weight is derived.
  // ---------------------------------------------------------------------
  var MEATS = {
    chicken: {
      key: 'chicken',
      label: 'Chicken',
      animalSingular: 'chicken',
      animalPlural: 'chickens',
      production: {
        head: 9.33e9, liveLb: 61.1e9, basis: 'live', source: 'nassPoultry',
        note: '9.33 billion broilers, 61.1 billion lb live weight'
      },
      dressing: { value: 0.75, source: 'umainePoultry',
        note: 'Ready-to-cook carcass as a share of live weight (70–78% typical).' },
      edibleOfCarcass: { value: 0.74, source: 'wiscPoultry',
        note: 'Boneless edible meat as a share of the ready-to-cook carcass.' },
      lifeDays: { value: 47, source: 'ncc',
        note: 'Average U.S. market age. The Welfare Footprint estimates below assume 42 days, so they are slightly conservative.' }
    },
    turkey: {
      key: 'turkey',
      label: 'Turkey',
      animalSingular: 'turkey',
      animalPlural: 'turkeys',
      production: {
        head: 200e6, liveLb: 6.58e9, basis: 'live', source: 'nassPoultry',
        note: '200 million turkeys raised, 6.58 billion lb live weight'
      },
      dressing: { value: 0.79, source: 'turkeyDressing',
        note: 'Ready-to-cook carcass as a share of live weight (77–81% typical).' },
      edibleOfCarcass: { value: 0.72, source: 'wiscPoultry',
        note: 'Assumed slightly below chicken (0.74) because of heavier bones. Not separately measured.' },
      lifeDays: { value: 112, source: 'nassPoultry',
        note: 'Assumption: hens are marketed at ~14 weeks and toms at ~18–20 weeks; 16 weeks used as a blend.' }
    },
    pork: {
      key: 'pork',
      label: 'Pork',
      animalSingular: 'pig',
      animalPlural: 'pigs',
      production: {
        head: 130e6, carcassLb: 27.8e9, basis: 'carcass', source: 'nassSlaughter',
        note: '130 million hogs slaughtered, 27.8 billion lb of pork (carcass weight)'
      },
      dressing: null, // USDA reports pork on a carcass basis, so no dressing step is needed.
      edibleOfCarcass: { value: 0.75, source: 'wiscPork',
        note: 'Hanging carcass yields about 75% as retail cuts, mostly bone-in.' },
      lifeDays: { value: 180, source: 'wiscPork',
        note: 'Assumption: market hogs are typically slaughtered at about 6 months of age.' }
    },
    beef: {
      key: 'beef',
      label: 'Beef',
      animalSingular: 'cow',
      animalPlural: 'cattle',
      production: {
        head: 31.8e6, carcassLb: 27.049e9, basis: 'carcass', source: 'nassSlaughter',
        note: '31.8 million cattle slaughtered, 27.05 billion lb of beef (carcass weight)'
      },
      dressing: null,
      edibleOfCarcass: { value: 0.62, source: 'sdsuBeef',
        note: 'Boneless retail cuts are about 60–65% of carcass weight.' },
      lifeDays: { value: 600, source: 'sdsuBeef',
        note: 'Assumption: fed cattle are slaughtered at roughly 18–22 months. Cull dairy cows (older) and calves are lumped in here, which is a simplification.' }
    }
  };

  // ---------------------------------------------------------------------
  // Welfare Footprint Project: time in pain for ONE conventional broiler.
  //
  // Values are the WFP central estimates for the conventional (fast-growing,
  // ~42-day) scenario. The 90% ranges are the ones WFP publishes. They are
  // consistent with WFP's headline that the Better Chicken Commitment
  // prevents 33 h of Disabling (66%), 79 h of Hurtful (24%) and 25 s of
  // Excruciating pain (78%) per bird.
  // ---------------------------------------------------------------------
  var PAIN_BY_INTENSITY = [
    { key: 'annoying', label: 'Annoying', hours: 324.7, low: 212.8, high: 436.5,
      blurb: 'Unpleasant, but does not disrupt normal activity.' },
    { key: 'hurtful', label: 'Hurtful', hours: 333.6, low: 195.1, high: 472.1,
      blurb: 'Hard to ignore; the bird is aware of it most of the time.' },
    { key: 'disabling', label: 'Disabling', hours: 50.3, low: 33.0, high: 67.5,
      blurb: 'Continuously distressing; no enjoyment is possible.' },
    { key: 'excruciating', label: 'Excruciating', hours: 30.2 / 3600, low: 8.8 / 3600, high: 51.6 / 3600,
      blurb: 'Intolerable even for seconds. Measured in seconds, not hours.' }
  ];

  // Hours of pain (all four intensities combined) per conventional broiler,
  // by cause. From WFP's per-harm "time in pain" dataset (the "average
  // population member" column, which already accounts for how many birds are
  // affected). Behavioural deprivations are frustration from being unable to
  // do things chickens are strongly motivated to do.
  var PAIN_BY_CAUSE = [
    { key: 'lameness', label: 'Lameness', hours: 457.9,
      blurb: 'Leg and joint disorders from growing too fast; walking hurts or becomes impossible.' },
    { key: 'foraging', label: 'No foraging or exploring', hours: 76.7,
      blurb: 'Barren sheds with nothing to scratch, peck or investigate.' },
    { key: 'dustbathing', label: 'No dustbathing', hours: 70.0,
      blurb: 'No loose, dry substrate for the bathing behaviour that keeps feathers healthy.' },
    { key: 'perching', label: 'No perching', hours: 63.0,
      blurb: 'No raised places to rest, which chickens seek out for safety.' },
    { key: 'heat', label: 'Heat stress', hours: 38.9,
      blurb: 'Heavy birds in crowded sheds cannot shed heat; they pant and become lethargic.' },
    { key: 'ascites', label: 'Ascites (heart & lung failure)', hours: 28.3,
      blurb: 'Fluid builds up in the abdomen when the heart cannot keep up with rapid growth.' },
    { key: 'suddenDeath', label: 'Sudden death syndrome', hours: 0.0,
      blurb: 'Acute heart failure. Brief but intense, so it adds almost no hours.' }
  ];

  // ---------------------------------------------------------------------
  // Derived per-animal figures (pure functions of the constants above).
  // ---------------------------------------------------------------------
  function derive(meat) {
    var p = meat.production;
    var perHeadLb = (p.basis === 'live' ? p.liveLb : p.carcassLb) / p.head;
    var perHeadKg = perHeadLb * LB_TO_KG;
    var liveKg = p.basis === 'live' ? perHeadKg : null;
    var carcassKg = p.basis === 'live' ? perHeadKg * meat.dressing.value : perHeadKg;
    var rawEdibleKg = carcassKg * meat.edibleOfCarcass.value;
    var cookedKg = rawEdibleKg * COOKING_YIELD.value;
    return {
      perHeadLb: perHeadLb,
      liveKg: liveKg,
      carcassKg: carcassKg,
      rawEdibleKg: rawEdibleKg,
      cookedKg: cookedKg,
      animalsPerCookedKg: 1 / cookedKg
    };
  }

  function gramsFrom(amount, unit) {
    if (!isFinite(amount) || amount < 0) return 0;
    return unit === 'oz' ? amount * OZ_TO_G : amount;
  }

  /**
   * intake: { chicken: grams, turkey: grams, pork: grams, beef: grams }
   *         all in COOKED grams per week.
   * Returns per-meat results for one week; multiply by 52 for a year.
   */
  function compute(intakeGramsPerWeek) {
    var out = {};
    Object.keys(MEATS).forEach(function (key) {
      var meat = MEATS[key];
      var d = derive(meat);
      var grams = Number(intakeGramsPerWeek[key]) || 0;
      var cookedKg = grams / 1000;
      var animals = cookedKg * d.animalsPerCookedKg;
      var r = {
        key: key,
        cookedKg: cookedKg,
        rawKg: cookedKg / COOKING_YIELD.value,
        animals: animals,
        animalDays: animals * meat.lifeDays.value,
        pain: null
      };
      if (key === 'chicken') {
        r.pain = {
          byIntensity: PAIN_BY_INTENSITY.map(function (p) {
            return { key: p.key, label: p.label, hours: animals * p.hours,
              low: animals * p.low, high: animals * p.high };
          }),
          byCause: PAIN_BY_CAUSE.map(function (c) {
            return { key: c.key, label: c.label, hours: animals * c.hours };
          }),
          totalHours: animals * PAIN_BY_INTENSITY.reduce(function (s, p) { return s + p.hours; }, 0)
        };
      }
      out[key] = r;
    });
    return out;
  }

  return {
    LB_TO_KG: LB_TO_KG,
    OZ_TO_G: OZ_TO_G,
    SOURCES: SOURCES,
    COOKING_YIELD: COOKING_YIELD,
    MEATS: MEATS,
    PAIN_BY_INTENSITY: PAIN_BY_INTENSITY,
    PAIN_BY_CAUSE: PAIN_BY_CAUSE,
    derive: derive,
    gramsFrom: gramsFrom,
    compute: compute
  };
});
