// Renders the Harms index (harms.html) and each harm's page (harms/<slug>.html) from text.js and report.js.
var HP = TEXT.harmsPage;

function harmSlug(name) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

function bookCite() {
  var b = REPORT.book;
  return b.authors + '. <a href="' + b.url + '"><i>' + b.title + '</i></a>. ' + b.publisher + ', ' + b.year;
}

function renderHarmsIndex() {
  document.title = HP.title;
  var h = '<h1>' + HP.title + '</h1><p>' + HP.intro.replace('{book}', bookCite()) + '</p><div class="cards">';
  Object.keys(HP.definitions).forEach(function (name) {
    var r = REPORT.harms[name] || { slug: harmSlug(name), pages: [] };
    var ph = HP.photos && HP.photos[name];
    h += '<a class="card" href="harms/' + r.slug + '.html">' + (ph ? '<img src="' + ph[0] + '" alt="" loading="lazy">' : '<div class="noimg"></div>') +
         '<span class="name">' + name + '</span></a>';
  });
  h += '</div>';
  if (HP.generalLinks && HP.generalLinks.length) {
    h += '<h2 class="links-heading">' + HP.generalHeading + '</h2><ul class="links">' + HP.generalLinks.map(function (l) {
      return '<li><a href="' + l[1] + '">' + l[0] + '</a>' + (l[2] ? ' <span class="note">' + l[2] + '</span>' : '') + '</li>';
    }).join('') + '</ul>';
  }
  document.getElementById('harms').innerHTML = h;
}

function renderHarmPage(name) {
  document.title = name;
  var r = REPORT.harms[name];
  var h = '<h1>' + name + '</h1>';
  var ph = HP.photos && HP.photos[name], cr = ph && typeof PHOTOS !== 'undefined' && PHOTOS[ph[0]];
  if (ph) h += '<figure class="harm-photo"><img src="../' + ph[0] + '" alt=""><figcaption>' + ph[1] +
               (cr ? ' <span class="credit">' + HP.photoCredit.replace('{author}', '<a href="' + cr.page + '">' + cr.author + '</a>').replace('{license}', '<a href="' + cr.licenseUrl + '">' + cr.license + '</a>') + '</span>' : '') +
               '</figcaption></figure>';
  if (HP.notes[name]) h += '<p class="muted">' + HP.notes[name] + '</p>';
  (HP.definitions[name] || []).forEach(function (d) { h += '<blockquote>' + d.quote + '<cite>' + d.cite + '</cite></blockquote>'; });
  var links = HP.links && HP.links[name];
  if (links && links.length) {
    h += '<h2 class="links-heading">' + HP.linksHeading + '</h2><ul class="links">' + links.map(function (l) {
      return '<li><a href="' + l[1] + '">' + l[0] + '</a>' + (l[2] ? ' <span class="note">' + l[2] + '</span>' : '') + '</li>';
    }).join('') + '</ul>';
  }
  h += '<h2 class="pages-heading">' + HP.pageIntro.replace('{name}', name.toLowerCase()).replace('{book}', bookCite().replace(/\.$/, '')) + '</h2>';
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
