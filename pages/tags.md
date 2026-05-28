---
layout: page
title: Tags
subtitle: Every tag, weighted by frequency.
permalink: /tags/
---

{% assign all_tags = "" | split: "" %}
{% for doc in site.knowledge %}
  {% if doc.tags %}
    {% for t in doc.tags %}{% assign all_tags = all_tags | push: t %}{% endfor %}
  {% endif %}
{% endfor %}
{% assign unique_tags = all_tags | uniq | sort %}

{% if unique_tags.size == 0 %}
  <p class="empty">No tags yet.</p>
{% else %}
  <ul class="tag-cloud">
    {% for t in unique_tags %}
      {% assign cnt = 0 %}
      {% for x in all_tags %}{% if x == t %}{% assign cnt = cnt | plus: 1 %}{% endif %}{% endfor %}
      {% assign weight = cnt | times: 4 | plus: 12 %}
      {% if weight > 28 %}{% assign weight = 28 %}{% endif %}
      <li><a href="{{ '/tags/' | append: t | append: '/' | relative_url }}" style="font-size: {{ weight }}px">#{{ t }} <span class="tc-count">{{ cnt }}</span></a></li>
    {% endfor %}
  </ul>
{% endif %}
