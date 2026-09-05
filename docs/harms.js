// Renders the Harms index (harms.html) and each harm's page (harms/<slug>.html) from text.js and report.js.
var HP = TEXT.harmsPage;

function harmSlug(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

function bookCite() {
  var b = REPORT.book;
  return b.authors + '. <a href="' + b.url + '"><i>' + b.title + '</i></a>. ' + b.publisher + ', ' + b.year;
}

function fillNav(prefix) {
  var ids = { 'nav-calc': TEXT.nav.calculator, 'nav-eq': TEXT.nav.equation, 'nav-harms': TEXT.nav.harms };
  Object.keys(ids).forEach(function (id) { var el = document.getElementById(id); if (el) el.textContent = ids[id]; });
}

function renderHarmsIndex() {
  fillNav('');
  document.title = HP.title;
  var h = '<h1>' + HP.title + '</h1><p>' + HP.intro.replace('{book}', bookCite()) + '</p>';
  Object.keys(HP.definitions).forEach(function (name) {
    var r = REPORT.harms[name] || { slug: harmSlug(name), pages: [] };
    var defs = HP.definitions[name];
    h += '<h2 id="' + r.slug + '">' + name + '</h2>';
    if (HP.notes[name]) h += '<p class="muted">' + HP.notes[name] + '</p>';
    defs.forEach(function (d) { h += '<blockquote>' + d.quote + '<cite>' + d.cite + '</cite></blockquote>'; });
    h += '<p class="pages"><a href="harms/' + r.slug + '.html">' + HP.pagesLink.replace('{n}', r.pages.length).replace('{name}', name.toLowerCase()) + '</a></p>';
  });
  document.getElementById('harms').innerHTML = h;
}

function renderHarmPage(name) {
  fillNav('../');
  document.title = name;
  var r = REPORT.harms[name];
  var h = '<h1>' + name + '</h1><p class="muted">' + HP.pageIntro.replace('{name}', name.toLowerCase()).replace('{book}', bookCite()) + '</p>';
  var byChapter = {};
  r.pages.forEach(function (p) { (byChapter[p[0]] = byChapter[p[0]] || []).push(p[1]); });
  REPORT.chapters.forEach(function (c) {
    var pages = byChapter[c.slug]; if (!pages) return;
    h += '<div class="chapter"><h2>' + HP.chapterLabel.replace('{n}', c.number).replace('{title}', c.title) + '</h2>';
    pages.forEach(function (n) {
      var nn = (n < 10 ? '0' : '') + n;
      h += '<div class="page"><img src="../report/' + c.slug + '/p' + nn + '.webp" alt="" loading="lazy"><p class="num">' +
           HP.pageLabel.replace('{n}', c.number).replace('{p}', n) + '</p></div>';
    });
    h += '</div>';
  });
  document.getElementById('harm').innerHTML = h;
}
