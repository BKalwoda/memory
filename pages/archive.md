---
layout: page
title: Archive
subtitle: Every entry, reverse-chronological, grouped by month.
permalink: /archive/
---

{% assign all = site.knowledge | sort: "created" | reverse %}

{% if all.size == 0 %}
  <p class="empty">No entries yet. Drop your first one into <code>_knowledge/</code> and rebuild.</p>
{% else %}
  {% assign current_group = "" %}
  {% for entry in all %}
    {% assign group = entry.created | date: "%B %Y" %}
    {% if group != current_group %}
      {% if current_group != "" %}</ul></section>{% endif %}
      <section class="archive-group">
        <h2>{{ group }}</h2>
        <ul class="archive-list">
      {% assign current_group = group %}
    {% endif %}
    <li>
      <time class="archive-date" datetime="{{ entry.created | date: '%Y-%m-%d' }}">{{ entry.created | date: "%b %-d" }}</time>
      <span class="archive-title">
        <a href="{{ entry.url | relative_url }}">{{ entry.title | escape }}</a>
        <span class="archive-cat">· {{ entry.category }}</span>
      </span>
    </li>
    {% if forloop.last %}</ul></section>{% endif %}
  {% endfor %}
{% endif %}
