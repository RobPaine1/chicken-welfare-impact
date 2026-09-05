/* Calculator page UI. All numbers come from calc.js. */
(function () {
  'use strict';
  var C = window.WelfareCalc;
  var MEAT_KEYS = Object.keys(C.MEATS);
  var STORAGE_KEY = 'meat-welfare-intake-v3';

  // Preset meals: cooked meat in grams. Portions are typical U.S. servings
  // (FNDDS / NHANES medians where available, otherwise common menu sizes).
  var PRESETS = [
    { group: 'Chicken', items: [
      { id: 'chk-sandwich', name: 'Grilled chicken sandwich', grams: { chicken: 85 } },
      { id: 'chk-fried-sandwich', name: 'Fried chicken sandwich', grams: { chicken: 100 } },
      { id: 'chk-nuggets', name: 'Chicken nuggets, 6 pieces', grams: { chicken: 95 } },
      { id: 'chk-tenders', name: 'Chicken tenders, 3 pieces', grams: { chicken: 100 } },
      { id: 'chk-wings', name: 'Chicken wings, 6 wings', grams: { chicken: 90 } },
      { id: 'chk-breast', name: 'Chicken breast dinner', grams: { chicken: 170 } },
      { id: 'chk-thigh', name: 'Two chicken thighs', grams: { chicken: 120 } },
      { id: 'chk-rotisserie', name: 'Quarter rotisserie chicken', grams: { chicken: 140 } },
      { id: 'chk-bowl', name: 'Chicken burrito or rice bowl', grams: { chicken: 110 } },
      { id: 'chk-salad', name: 'Chicken caesar salad', grams: { chicken: 85 } },
      { id: 'chk-soup', name: 'Bowl of chicken noodle soup', grams: { chicken: 25 } }
    ] },
    { group: 'Turkey', items: [
      { id: 'tky-sandwich', name: 'Turkey deli sandwich', grams: { turkey: 56 } },
      { id: 'tky-dinner', name: 'Roast turkey dinner', grams: { turkey: 170 } },
      { id: 'tky-burger', name: 'Turkey burger', grams: { turkey: 110 } }
    ] },
    { group: 'Pork', items: [
      { id: 'prk-bacon', name: 'Three strips of bacon', grams: { pork: 24 } },
      { id: 'prk-sausage', name: 'Two breakfast sausage links', grams: { pork: 50 } },
      { id: 'prk-ham', name: 'Ham sandwich', grams: { pork: 56 } },
      { id: 'prk-chop', name: 'Pork chop', grams: { pork: 140 } },
      { id: 'prk-pulled', name: 'Pulled pork sandwich', grams: { pork: 110 } },
      { id: 'prk-pizza', name: 'Two slices of pepperoni pizza', grams: { pork: 20 } }
    ] },
    { group: 'Beef', items: [
      { id: 'bf-burger', name: 'Quarter-pound burger', grams: { beef: 85 } },
      { id: 'bf-bacon-burger', name: 'Bacon cheeseburger', grams: { beef: 85, pork: 16 } },
      { id: 'bf-steak', name: '8 oz steak', grams: { beef: 170 } },
      { id: 'bf-tacos', name: 'Two beef tacos', grams: { beef: 85 } },
      { id: 'bf-bolognese', name: 'Spaghetti bolognese', grams: { beef: 85 } }
    ] }
  ];
  var PRESET_BY_ID = {};
  PRESETS.forEach(function (g) { g.items.forEach(function (it) { PRESET_BY_ID[it.id] = it; }); });

  // ---------- formatting ----------
  function fmtNum(x) {
    if (!isFinite(x)) return '–';
    var abs = Math.abs(x), digits;
    if (abs >= 100) digits = 0;
    else if (abs >= 10) digits = 1;
    else if (abs >= 1) digits = 2;
    else if (abs === 0) digits = 0;
    else digits = Math.max(2, 1 - Math.floor(Math.log10(abs)));
    return x.toLocaleString(undefined, { maximumFractionDigits: digits });
  }
  function fmtHours(h) {
    if (h === 0) return '0 h';
    if (h < 1 / 60) return fmtNum(h * 3600) + ' s';
    if (h < 1) return fmtNum(h * 60) + ' min';
    if (h >= 96) return fmtNum(h) + ' h (' + fmtNum(h / 24) + ' days)';
    return fmtNum(h) + ' h';
  }
  function fmtWeight(kg) { return kg >= 1 ? fmtNum(kg) + ' kg' : fmtNum(kg * 1000) + ' g'; }
  function plural(n, one, many) { return Math.abs(n - 1) < 1e-9 ? one : many; }
  function fmtAnimals(n, meat) {
    if (n > 0 && n < 0.67) return '1/' + Math.round(1 / n) + ' of a ' + meat.animalSingular;
    return fmtNum(n) + ' ' + plural(n, meat.animalSingular, meat.animalPlural);
  }
  function joinList(items) {
    if (items.length === 1) return items[0];
    if (items.length === 2) return items[0] + ' and ' + items[1];
    return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
  }

  // ---------- inputs & state ----------
  var vals = { meal: {}, week: {} }; // remembered separately per mode
  var intakeEl = document.getElementById('intake');
  MEAT_KEYS.forEach(function (key) {
    var row = document.createElement('div');
    row.className = 'intake-row';
    row.innerHTML = '<label for="in-' + key + '">' + C.MEATS[key].label + '</label>' +
      '<div class="amount"><input type="number" id="in-' + key + '" min="0" step="any" inputmode="decimal" placeholder="0">' +
      '<span class="unit-label" data-unit-label></span></div>';
    intakeEl.appendChild(row);
  });
  function $(id) { return document.getElementById(id); }
  var presetEl = $('preset');
  presetEl.innerHTML = '<option value="">Choose a meal…</option>' + PRESETS.map(function (g) {
    return '<optgroup label="' + g.group + '">' + g.items.map(function (it) {
      return '<option value="' + it.id + '">' + it.name + '</option>';
    }).join('') + '</optgroup>';
  }).join('');
  function usingPreset() { return checked('mode') === 'meal' && checked('mealInput') === 'preset'; }
  function checked(name) { return document.querySelector('input[name=' + name + ']:checked').value; }
  function captureInputs() { MEAT_KEYS.forEach(function (k) { vals[checked('mode')][k] = $('in-' + k).value; }); }
  function restoreInputs() { MEAT_KEYS.forEach(function (k) { $('in-' + k).value = vals[checked('mode')][k] || ''; }); }
  function readIntakeGrams() {
    var g = {};
    if (usingPreset()) {
      var it = PRESET_BY_ID[presetEl.value];
      MEAT_KEYS.forEach(function (k) { g[k] = it ? (it.grams[k] || 0) : 0; });
      return g;
    }
    MEAT_KEYS.forEach(function (k) { g[k] = C.gramsFrom(parseFloat($('in-' + k).value), checked('unit')); });
    return g;
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: checked('mode'), unit: checked('unit'), period: checked('period'), mealInput: checked('mealInput'), preset: presetEl.value, vals: vals })); } catch (e) {}
  }
  function loadState() {
    try {
      var s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!s) return;
      ['mode', 'unit', 'period', 'mealInput'].forEach(function (n) { if (s[n] && $(n + '-' + s[n])) $(n + '-' + s[n]).checked = true; });
      if (s.preset && PRESET_BY_ID[s.preset]) presetEl.value = s.preset;
      if (s.vals) { vals.meal = s.vals.meal || {}; vals.week = s.vals.week || {}; }
    } catch (e) {}
  }

  // ---------- render ----------
  function render() {
    var isMeal = checked('mode') === 'meal';
    var period = isMeal ? 'meal' : checked('period');
    var mult = period === 'year' ? 52 : 1;
    var base = C.compute(readIntakeGrams());

    var preset = usingPreset();
    $('period-control').style.display = isMeal ? 'none' : '';
    $('meal-input-control').style.display = isMeal ? '' : 'none';
    $('preset-panel').style.display = preset ? '' : 'none';
    $('weight-panel').style.display = preset ? 'none' : '';
    if (preset) {
      var it = PRESET_BY_ID[presetEl.value];
      $('preset-note').innerHTML = it
        ? 'Assumes about ' + Object.keys(it.grams).map(function (k) {
            return fmtWeight(it.grams[k] / 1000) + ' (' + fmtNum(it.grams[k] / C.OZ_TO_G) + ' oz) of cooked ' + C.MEATS[k].label.toLowerCase();
          }).join(' and ') + '. <a href="#" id="adjust-link">Adjust the weight</a>'
        : 'Portions are typical U.S. servings. Pick "Enter weight" to use your own.';
      var adj = $('adjust-link');
      if (adj) adj.addEventListener('click', function (e) {
        e.preventDefault();
        var unit = checked('unit');
        MEAT_KEYS.forEach(function (k) {
          var g = it.grams[k] || 0;
          vals.meal[k] = g ? (unit === 'oz' ? Math.round(g / C.OZ_TO_G * 10) / 10 : g) : '';
        });
        $('mealInput-weight').checked = true;
        restoreInputs(); render(); saveState();
      });
    }
    document.querySelectorAll('[data-unit-label]').forEach(function (el) {
      el.textContent = checked('unit') + (isMeal ? ' in this meal' : ' per week');
    });

    var active = MEAT_KEYS.filter(function (k) { return base[k].animals > 0; });
    if (!active.length) {
      $('headline').innerHTML = '<span class="empty">' + (preset ? 'Choose a meal above.' : isMeal ? 'Enter what was on your plate, or tap a portion above.' : 'Enter what you eat in a typical week.') + '</span>';
      $('cards').innerHTML = '';
      return;
    }
    var parts = active.map(function (k) { return '<strong>' + fmtAnimals(base[k].animals * mult, C.MEATS[k]) + '</strong>'; });
    var days = active.reduce(function (s, k) { return s + base[k].animalDays * mult; }, 0);
    $('headline').innerHTML = (isMeal ? 'This meal used about ' : 'Over a ' + period + ', this uses about ') +
      joinList(parts) + ', which is ' + fmtNum(days) + ' days of animal life.';
    $('cards').innerHTML = active.map(function (k) { return meatCard(k, base[k], mult, period, isMeal); }).join('');
    requestAnimationFrame(function () {
      document.querySelectorAll('.bar-fill[data-w]').forEach(function (el) { el.style.width = el.getAttribute('data-w') + '%'; });
    });
  }

  function meatCard(key, r, mult, period, isMeal) {
    var m = C.MEATS[key];
    var animals = r.animals * mult;
    var html = '<section class="card meat-card"><h3>' + m.label +
      ' <small>' + fmtWeight(r.cookedKg * mult) + ' cooked' + (isMeal ? '' : ' per ' + period) + '</small></h3>' +
      '<div class="stats">' +
      '<div class="stat"><div class="num">' + fmtAnimals(animals, m) + '</div><div class="lbl">' + (isMeal ? 'on this plate' : 'used') + '</div></div>' +
      '<div class="stat"><div class="num">' + fmtNum(r.animalDays * mult) + '</div><div class="lbl">days of ' + m.animalSingular + ' life (each lives ' + m.lifeDays.value + ')</div></div>' +
      '</div>';

    if (r.pain) {
      var max = Math.max.apply(null, r.pain.byCause.map(function (c) { return c.hours; })) * mult || 1;
      html += '<div class="pain-head"><h4>' + fmtHours(r.pain.totalHours * mult) + ' of pain' + (isMeal ? ' behind this plate' : '') + ', by cause</h4>' +
        '<a href="method.html#causes">What are these?</a></div><div class="bars">' +
        r.pain.byCause.filter(function (c) { return c.hours > 0; }).map(function (c) {
          var w = Math.min(100, (c.hours * mult) / max * 100);
          return '<div><div class="bar-head"><span>' + c.label + '</span><span class="val">' + fmtHours(c.hours * mult) + '</span></div>' +
            '<div class="bar-track"><div class="bar-fill" data-w="' + w.toFixed(1) + '"></div></div></div>';
        }).join('') + '</div>';
      var byI = r.pain.byIntensity;
      html += '<p class="intensity">By intensity: ' + byI.map(function (p) { return fmtHours(p.hours * mult) + ' ' + p.label.toLowerCase(); }).join(', ') + '.</p>';
    } else {
      html += '<p class="nopain">No cumulative-pain estimate has been published for ' + m.animalPlural + ' yet, so only animals and days of life are shown.</p>';
    }
    return html + '</section>';
  }

  // ---------- wiring ----------
  loadState();
  restoreInputs();
  render();
  document.querySelectorAll('#intake input').forEach(function (el) {
    el.addEventListener('input', function () { captureInputs(); render(); saveState(); });
  });
  document.querySelectorAll('input[name=mode]').forEach(function (el) {
    el.addEventListener('change', function () { restoreInputs(); render(); saveState(); });
  });
  document.querySelectorAll('input[name=mealInput]').forEach(function (el) {
    el.addEventListener('change', function () { render(); saveState(); });
  });
  presetEl.addEventListener('change', function () { render(); saveState(); });
  document.querySelectorAll('input[name=unit], input[name=period]').forEach(function (el) {
    el.addEventListener('change', function () { render(); saveState(); });
  });
  document.querySelectorAll('.chip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var oz = parseFloat(btn.getAttribute('data-oz'));
      var input = $('in-' + btn.getAttribute('data-fill'));
      input.value = checked('unit') === 'oz' ? oz : Math.round(oz * C.OZ_TO_G);
      captureInputs(); render(); saveState();
    });
  });
})();
