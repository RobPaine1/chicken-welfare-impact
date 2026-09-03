/* Renders the explanation page from the same constants the calculator uses. */
(function () {
  'use strict';
  var C = window.WelfareCalc;
  var MEAT_KEYS = Object.keys(C.MEATS);

  function fmtNum(x) {
    if (!isFinite(x)) return '–';
    var abs = Math.abs(x), digits;
    if (abs >= 100) digits = 0; else if (abs >= 10) digits = 1; else if (abs >= 1) digits = 2;
    else if (abs === 0) digits = 0; else digits = Math.max(2, 1 - Math.floor(Math.log10(abs)));
    return x.toLocaleString(undefined, { maximumFractionDigits: digits });
  }
  function fmtHours(h) {
    if (h === 0) return '0 h';
    if (h < 1 / 60) return fmtNum(h * 3600) + ' s';
    if (h < 1) return fmtNum(h * 60) + ' min';
    if (h >= 96) return fmtNum(h) + ' h (' + fmtNum(h / 24) + ' days)';
    return fmtNum(h) + ' h';
  }
  function fmtKg(kg) { return fmtNum(kg) + ' kg'; }
  function fmtPct(v) { return Math.round(v * 100) + '%'; }

  var sourceOrder = [];
  function cite(key) {
    var i = sourceOrder.indexOf(key);
    if (i < 0) { sourceOrder.push(key); i = sourceOrder.length - 1; }
    return '<sup><a href="#src-' + key + '">' + (i + 1) + '</a></sup>';
  }

  var ch = C.MEATS.chicken, d = C.derive(ch), p = ch.production;
  document.getElementById('chicken-chain').textContent =
    'live weight     = ' + fmtNum(p.liveLb / 1e9) + ' billion lb ÷ ' + fmtNum(p.head / 1e9) + ' billion birds  = ' + fmtNum(d.perHeadLb) + ' lb = ' + fmtKg(d.liveKg) + '\n' +
    'carcass         = ' + fmtKg(d.liveKg) + ' × ' + ch.dressing.value + ' dressing                 = ' + fmtKg(d.carcassKg) + '\n' +
    'raw edible meat = ' + fmtKg(d.carcassKg) + ' × ' + ch.edibleOfCarcass.value + ' edible share             = ' + fmtKg(d.rawEdibleKg) + '\n' +
    'cooked meat     = ' + fmtKg(d.rawEdibleKg) + ' × ' + C.COOKING_YIELD.value + ' cooking yield            = ' + fmtKg(d.cookedKg) + '\n\n' +
    'chickens per kg cooked = 1 ÷ ' + fmtNum(d.cookedKg) + '                         = ' + fmtNum(d.animalsPerCookedKg) + '\n' +
    'days of life per kg    = ' + fmtNum(d.animalsPerCookedKg) + ' × ' + ch.lifeDays.value + ' days                  = ' + fmtNum(d.animalsPerCookedKg * ch.lifeDays.value) + '\n' +
    'disabling pain per kg  = ' + fmtNum(d.animalsPerCookedKg) + ' × ' + C.PAIN_BY_INTENSITY[2].hours + ' h                  = ' + fmtNum(d.animalsPerCookedKg * C.PAIN_BY_INTENSITY[2].hours) + ' h';
  document.getElementById('chicken-per-kg').textContent = fmtNum(d.animalsPerCookedKg);
  document.getElementById('chicken-days').textContent = ch.lifeDays.value;
  document.getElementById('chicken-per-serving').textContent = '1/' + Math.round(1 / (d.animalsPerCookedKg * C.gramsFrom(4, 'oz') / 1000));
  document.getElementById('cooking-yield').innerHTML = C.COOKING_YIELD.value + cite(C.COOKING_YIELD.source);

  document.querySelector('#meat-table tbody').innerHTML = MEAT_KEYS.map(function (k) {
    var m = C.MEATS[k], x = C.derive(m);
    return '<tr><td>' + m.label + '</td>' +
      '<td class="num">' + (x.liveKg ? fmtKg(x.liveKg) : '<span class="src">carcass basis</span>') + cite(m.production.source) + '</td>' +
      '<td class="num">' + (m.dressing ? fmtPct(m.dressing.value) + cite(m.dressing.source) : '–') + '</td>' +
      '<td class="num">' + fmtKg(x.carcassKg) + '</td>' +
      '<td class="num">' + fmtPct(m.edibleOfCarcass.value) + cite(m.edibleOfCarcass.source) + '</td>' +
      '<td class="num">' + fmtKg(x.rawEdibleKg) + '</td>' +
      '<td class="num">' + fmtKg(x.cookedKg) + '</td>' +
      '<td class="num">' + m.lifeDays.value + cite(m.lifeDays.source) + '</td></tr>';
  }).join('');

  var totalI = C.PAIN_BY_INTENSITY.reduce(function (s, q) { return s + q.hours; }, 0);
  document.querySelector('#intensity-table tbody').innerHTML = C.PAIN_BY_INTENSITY.map(function (q) {
    return '<tr><td>' + q.label + cite('wfpBroilers') + '</td><td class="num">' + fmtHours(q.hours) + '</td>' +
      '<td class="num">' + fmtHours(q.low) + ' – ' + fmtHours(q.high) + '</td><td>' + q.blurb + '</td></tr>';
  }).join('') + '<tr><td><strong>Total</strong></td><td class="num"><strong>' + fmtHours(totalI) +
    '</strong></td><td></td><td class="src">Out of a ' + ch.lifeDays.value + '-day life, which is ' + fmtNum(ch.lifeDays.value * 24) + ' hours.</td></tr>';

  var totalC = C.PAIN_BY_CAUSE.reduce(function (s, c) { return s + c.hours; }, 0);
  document.querySelector('#cause-table tbody').innerHTML = C.PAIN_BY_CAUSE.map(function (c) {
    return '<tr><td>' + c.label + cite('painTrack') + '</td><td class="num">' + fmtHours(c.hours) + '</td><td>' + c.blurb + '</td></tr>';
  }).join('') + '<tr><td><strong>Total</strong></td><td class="num"><strong>' + fmtHours(totalC) + '</strong></td><td></td></tr>';

  cite('wfpIntensities'); cite('wfpBook'); cite('faunalytics');

  document.getElementById('sources').innerHTML = sourceOrder.map(function (key) {
    var s = C.SOURCES[key], notes = [];
    if (C.COOKING_YIELD.source === key) notes.push(C.COOKING_YIELD.note);
    MEAT_KEYS.forEach(function (k) {
      var m = C.MEATS[k];
      ['production', 'dressing', 'edibleOfCarcass', 'lifeDays'].forEach(function (f) {
        if (m[f] && m[f].source === key && m[f].note) notes.push(m.label + ': ' + m[f].note);
      });
    });
    return '<li id="src-' + key + '"><a href="' + s.url + '" rel="noopener">' + s.title + '</a>' +
      (notes.length ? '<div class="src">' + notes.join(' ') + '</div>' : '') + '</li>';
  }).join('');
})();
