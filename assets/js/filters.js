(function () {
  'use strict';

  // Optional tag/category chip filter for listing pages.
  // Activates when a container with data-filterable exists.
  document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('[data-filterable]');
    if (!container) return;

    var cards = Array.prototype.slice.call(container.querySelectorAll('.entry-card'));
    var input = document.getElementById('filter-input');
    var tagSel = document.getElementById('filter-tag');

    function refresh() {
      var q = (input && input.value || '').trim().toLowerCase();
      var tag = (tagSel && tagSel.value || '');
      cards.forEach(function (card) {
        var match = true;
        if (q) {
          var text = card.textContent.toLowerCase();
          if (text.indexOf(q) === -1) match = false;
        }
        if (tag) {
          var tags = (card.dataset.tags || '').split(',');
          if (tags.indexOf(tag) === -1) match = false;
        }
        card.style.display = match ? '' : 'none';
      });
    }

    if (input) input.addEventListener('input', refresh);
    if (tagSel) tagSel.addEventListener('change', refresh);
  });
})();
