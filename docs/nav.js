// Fills the left-hand nav on every page. The page sets data-page on <body> (which entry is current)
// and data-root ('' at the top level, '../' inside docs/harms/). Labels come from text.js.
(function () {
  var pages = [['calculator', 'index.html'], ['methodology', 'methodology.html'], ['harms', 'harms.html'], ['about', 'about.html']];
  var body = document.body, root = body.getAttribute('data-root') || '', current = body.getAttribute('data-page');
  var nav = document.getElementById('side'); if (!nav) return;
  pages.forEach(function (p) {
    var el = document.createElement(p[0] === current ? 'b' : 'a');
    el.textContent = TEXT.nav[p[0]];
    if (p[0] !== current) el.href = root + p[1];
    nav.appendChild(el);
  });
})();
