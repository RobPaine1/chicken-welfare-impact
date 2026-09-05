const test = require('node:test');
const assert = require('node:assert/strict');
const calc = require('../calc.js');

const near = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} not within ${tol} of ${b}`);

test('broiler live weight matches USDA 2024 average (~6.55 lb)', () => {
  const d = calc.derive(calc.MEATS.chicken);
  near(d.perHeadLb, 6.55, 0.02);
  near(d.liveKg, 2.97, 0.01);
});

test('one broiler yields about 1.65 kg raw / 1.24 kg cooked edible meat', () => {
  const d = calc.derive(calc.MEATS.chicken);
  near(d.rawEdibleKg, 1.648, 0.005);
  near(d.cookedKg, 1.236, 0.005);
  near(d.animalsPerCookedKg, 0.809, 0.002);
});

test('carcass-basis meats skip the dressing step', () => {
  const beef = calc.derive(calc.MEATS.beef);
  near(beef.carcassKg, 850.6 * calc.LB_TO_KG, 0.5);
  assert.equal(beef.liveKg, null);
  const pork = calc.derive(calc.MEATS.pork);
  near(pork.carcassKg, 213.8 * calc.LB_TO_KG, 0.2);
});

test('unit conversion', () => {
  near(calc.gramsFrom(4, 'oz'), 113.4, 0.01);
  assert.equal(calc.gramsFrom(250, 'g'), 250);
  assert.equal(calc.gramsFrom(-5, 'oz'), 0);
  assert.equal(calc.gramsFrom(NaN, 'oz'), 0);
});

test('compute: 1 lb of cooked chicken a week ≈ 0.37 chickens, ~18 h disabling pain', () => {
  const r = calc.compute({ chicken: 453.6 });
  near(r.chicken.animals, 0.367, 0.003);
  near(r.chicken.animalDays, 0.367 * 47, 0.2);
  const disabling = r.chicken.pain.byIntensity.find(p => p.key === 'disabling');
  near(disabling.hours, 0.367 * 50.3, 0.2);
  const lame = r.chicken.pain.byCause.find(c => c.key === 'lameness');
  near(lame.hours, 0.367 * 457.9, 1.5);
});

test('compute: zero and missing intakes give zero, non-chicken has no pain data', () => {
  const r = calc.compute({});
  for (const k of Object.keys(calc.MEATS)) {
    assert.equal(r[k].animals, 0);
    assert.equal(r[k].animalDays, 0);
  }
  assert.equal(r.beef.pain, null);
  assert.equal(r.chicken.pain.totalHours, 0);
});

test('WFP intensity totals are consistent with the published BCC reductions', () => {
  const by = Object.fromEntries(calc.PAIN_BY_INTENSITY.map(p => [p.key, p.hours]));
  near(by.disabling * 0.66, 33, 1);          // "at least 33 h of Disabling pain prevented" = 66%
  near(by.hurtful * 0.24, 79, 2);            // "79 h of Hurtful pain prevented" = 24%
  near(by.excruciating * 3600 * 0.78, 25, 2); // "25 s of Excruciating pain prevented" = 78%
});

test('per-cause and per-intensity totals agree to within ~5%', () => {
  const cause = calc.PAIN_BY_CAUSE.reduce((s, c) => s + c.hours, 0);
  const intensity = calc.PAIN_BY_INTENSITY.reduce((s, p) => s + p.hours, 0);
  assert.ok(Math.abs(cause - intensity) / intensity < 0.05, `${cause} vs ${intensity}`);
});

test('every constant cites a known source', () => {
  const keys = new Set(Object.keys(calc.SOURCES));
  assert.ok(keys.has(calc.COOKING_YIELD.source));
  for (const m of Object.values(calc.MEATS)) {
    assert.ok(keys.has(m.production.source), m.key);
    assert.ok(keys.has(m.edibleOfCarcass.source), m.key);
    assert.ok(keys.has(m.lifeDays.source), m.key);
    if (m.dressing) assert.ok(keys.has(m.dressing.source), m.key);
  }
});
