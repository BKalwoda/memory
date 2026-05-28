---
layout: page
title: Search
subtitle: Full-text search across every entry. Filter by category or tag.
permalink: /search/
scripts:
  - /assets/js/search.js
---

<div class="search-tools">
  <input id="search-input" class="search-input" type="search" placeholder="Search titles, tags, summaries, and body…" aria-label="Search query" autocomplete="off" autofocus>
  <select id="search-category" class="search-select" aria-label="Filter by category">
    <option value="">All categories</option>
  </select>
  <select id="search-tag" class="search-select" aria-label="Filter by tag">
    <option value="">All tags</option>
  </select>
</div>

<p id="search-status" class="search-status" aria-live="polite">Loading…</p>

<div id="search-results" class="search-results" role="region" aria-live="polite"></div>
