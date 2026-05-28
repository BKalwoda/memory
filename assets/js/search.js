(function () {
  'use strict';

  var INDEX_URL = (window.MEMORY_BASEURL || '') + '/search.json';
  var LUNR_URL  = 'https://cdn.jsdelivr.net/npm/lunr@2.3.9/lunr.min.js';

  var input    = document.getElementById('search-input');
  var catSel   = document.getElementById('search-category');
  var tagSel   = document.getElementById('search-tag');
  var results  = document.getElementById('search-results');
  var status   = document.getElementById('search-status');

  if (!input || !results) return;

  var docs = [];
  var idx  = null;
  var ready = false;

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  function highlight(text, terms) {
    if (!text) return '';
    var safe = escapeHtml(text);
    if (!terms || !terms.length) return safe;
    var pattern = new RegExp('(' + terms.map(function (t) {
      return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|') + ')', 'gi');
    return safe.replace(pattern, '<mark>$1</mark>');
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  function buildSelectOptions() {
    if (catSel) {
      var cats = {};
      docs.forEach(function (d) { if (d.category) cats[d.category] = true; });
      Object.keys(cats).sort().forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        catSel.appendChild(opt);
      });
    }
    if (tagSel) {
      var tags = {};
      docs.forEach(function (d) { (d.tags || []).forEach(function (t) { tags[t] = true; }); });
      Object.keys(tags).sort().forEach(function (t) {
        var opt = document.createElement('option');
        opt.value = t;
        opt.textContent = '#' + t;
        tagSel.appendChild(opt);
      });
    }
  }

  function render(query) {
    var q = (query || '').trim();
    var cat = catSel ? catSel.value : '';
    var tag = tagSel ? tagSel.value : '';
    results.innerHTML = '';

    var terms = q.split(/\s+/).filter(Boolean);

    var matches;
    if (q && idx) {
      try {
        matches = idx.search(q).map(function (r) {
          var d = docs.find(function (x) { return x.id === r.ref; });
          return d ? { doc: d, score: r.score } : null;
        }).filter(Boolean);
      } catch (e) {
        // Lunr throws on partial syntax; fall back to substring match
        var lc = q.toLowerCase();
        matches = docs.filter(function (d) {
          return (d.title + ' ' + d.summary + ' ' + (d.tags || []).join(' ')).toLowerCase().indexOf(lc) !== -1;
        }).map(function (d) { return { doc: d, score: 0 }; });
      }
    } else if (!q) {
      matches = docs.slice().sort(function (a, b) {
        return (b.date || '').localeCompare(a.date || '');
      }).slice(0, 30).map(function (d) { return { doc: d, score: 0 }; });
    } else {
      matches = [];
    }

    if (cat) matches = matches.filter(function (m) { return (m.doc.category || '').indexOf(cat) === 0; });
    if (tag) matches = matches.filter(function (m) { return (m.doc.tags || []).indexOf(tag) !== -1; });

    if (status) {
      if (!ready) {
        status.textContent = 'Loading index…';
      } else if (q || cat || tag) {
        status.textContent = matches.length + ' match' + (matches.length === 1 ? '' : 'es');
      } else {
        status.textContent = 'Showing ' + matches.length + ' most recent. Type to search.';
      }
    }

    if (!matches.length) {
      var empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = ready ? 'No matches.' : 'Loading…';
      results.appendChild(empty);
      return;
    }

    matches.slice(0, 50).forEach(function (m) {
      var d = m.doc;
      var el = document.createElement('article');
      el.className = 'search-result';
      el.innerHTML =
        '<div class="crumb">' + escapeHtml(d.category || '') + '</div>' +
        '<h3><a href="' + escapeHtml(d.url) + '">' + highlight(d.title, terms) + '</a></h3>' +
        (d.summary ? '<p>' + highlight(d.summary, terms) + '</p>' : '') +
        (d.tags && d.tags.length
          ? '<p class="crumb">' + d.tags.map(function (t) { return '#' + escapeHtml(t); }).join(' ') + '</p>'
          : '');
      results.appendChild(el);
    });
  }

  function init(data) {
    docs = data.map(function (d, i) {
      return Object.assign({}, d, { id: String(i) });
    });

    idx = lunr(function () {
      this.ref('id');
      this.field('title', { boost: 10 });
      this.field('tags',  { boost: 5  });
      this.field('summary', { boost: 3 });
      this.field('category', { boost: 2 });
      this.field('body');
      var self = this;
      docs.forEach(function (d) {
        self.add({
          id: d.id,
          title: d.title,
          tags: (d.tags || []).join(' '),
          summary: d.summary,
          category: d.category,
          body: d.body
        });
      });
    });

    ready = true;
    buildSelectOptions();
    render(input.value);
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  input.addEventListener('input', debounce(function () { render(input.value); }, 60));
  if (catSel) catSel.addEventListener('change', function () { render(input.value); });
  if (tagSel) tagSel.addEventListener('change', function () { render(input.value); });

  if (status) status.textContent = 'Loading…';

  loadScript(LUNR_URL)
    .then(function () { return fetch(INDEX_URL); })
    .then(function (r) { return r.json(); })
    .then(init)
    .catch(function (err) {
      if (status) status.textContent = 'Search index failed to load: ' + err.message;
      console.error(err);
    });
})();
