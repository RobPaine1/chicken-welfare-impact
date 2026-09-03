/* Calculator page UI. All numbers come from calc.js. */
(function () {
  'use strict';
  var C = window.WelfareCalc;
  var MEAT_KEYS = Object.keys(C.MEATS);
  var STORAGE_KEY = 'meat-welfare-intake-v2';

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
  function checked(name) { return document.querySelector('input[name=' + name + ']:checked').value; }
  function captureInputs() { MEAT_KEYS.forEach(function (k) { vals[checked('mode')][k] = $('in-' + k).value; }); }
  function restoreInputs() { MEAT_KEYS.forEach(function (k) { $('in-' + k).value = vals[checked('mode')][k] || ''; }); }
  function readIntakeGrams() {
    var g = {};
    MEAT_KEYS.forEach(function (k) { g[k] = C.gramsFrom(parseFloat($('in-' + k).value), checked('unit')); });
    return g;
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: checked('mode'), unit: checked('unit'), period: checked('period'), vals: vals })); } catch (e) {}
  }
  function loadState() {
    try {
      var s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!s) return;
      ['mode', 'unit', 'period'].forEach(function (n) { if (s[n] && $(n + '-' + s[n])) $(n + '-' + s[n]).checked = true; });
      if (s.vals) { vals.meal = s.vals.meal || {}; vals.week = s.vals.week || {}; }
    } catch (e) {}
  }

  // ---------- render ----------
  function render() {
    var isMeal = checked('mode') === 'meal';
    var period = isMeal ? 'meal' : checked('period');
    var mult = period === 'year' ? 52 : 1;
    var base = C.compute(readIntakeGrams());

    $('period-control').style.display = isMeal ? 'none' : '';
    document.querySelectorAll('[data-unit-label]').forEach(function (el) {
      el.textContent = checked('unit') + (isMeal ? ' in this meal' : ' per week');
    });

    var active = MEAT_KEYS.filter(function (k) { return base[k].animals > 0; });
    if (!active.length) {
      $('headline').innerHTML = '<span class="empty">' + (isMeal ? 'Enter what was on your plate, or tap a portion above.' : 'Enter what you eat in a typical week.') + '</span>';
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
