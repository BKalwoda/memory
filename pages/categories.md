---
layout: page
title: Categories
subtitle: The full category tree. Adjust in <code>_data/categories.yml</code>.
permalink: /categories/
---

<div class="tile-grid">
  {% for top in site.data.categories %}
    {% assign top_count = site.knowledge | where_exp: "d", "d.category contains top.slug" | size %}
    <a class="tile" href="{{ '/categories/' | append: top.slug | append: '/' | relative_url }}">
      <span class="tile-icon" aria-hidden="true">{{ top.icon }}</span>
      <span class="tile-label">{{ top.label }}</span>
      <span class="tile-meta">{{ top_count }} {% if top_count == 1 %}entry{% else %}entries{% endif %}</span>
      {% if top.description %}<span class="tile-desc">{{ top.description }}</span>{% endif %}
    </a>
  {% endfor %}
</div>

<section class="section">
  <h2>All categories (including sub-categories)</h2>
  <ul class="cat-tree">
    {% for top in site.data.categories %}
      {% assign top_count = site.knowledge | where_exp: "d", "d.category contains top.slug" | size %}
      <li>
        <a href="{{ '/categories/' | append: top.slug | append: '/' | relative_url }}">
          <span class="cat-icon" aria-hidden="true">{{ top.icon }}</span>
          <strong>{{ top.label }}</strong>
          <span class="cat-count">{{ top_count }}</span>
        </a>
        {% if top.children %}
          <ul>
            {% for child in top.children %}
              {% assign child_count = site.knowledge | where: "category", child.slug | size %}
              <li>
                <a href="{{ '/categories/' | append: child.slug | append: '/' | relative_url }}">
                  {{ child.label }}
                  <span class="cat-count">{{ child_count }}</span>
                </a>
              </li>
            {% endfor %}
          </ul>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
</section>
