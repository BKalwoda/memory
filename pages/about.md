---
layout: page
title: About
subtitle: What this site is and how it works.
permalink: /about/
---

**Memory** is a personal knowledge vault — a place to store distilled summaries,
decisions, code snippets, research notes, and workflows extracted from
conversations with Claude (or anywhere else). It is built with Jekyll, hosted
on GitHub Pages, and designed to remain useful for years without
maintenance.

## Why a static site?

- **Durable.** Markdown files in a Git repo outlive any SaaS tool.
- **Portable.** Every entry is a plain text file with stable frontmatter; an
  AI agent or a future you can parse, edit, or migrate it trivially.
- **Searchable.** Full-text search runs entirely in the browser via
  [Lunr.js](https://lunrjs.com/), so there's no backend to keep alive.
- **Cheap.** Free on GitHub Pages.

## How an entry is structured

Every Markdown file under `_knowledge/` carries a YAML frontmatter block
that documents what the entry is. This is the contract that lets future
sessions read and update content programmatically:

{% include frontmatter-schema.html %}

The body uses a light set of conventional sections — `## Summary`,
`## Details`, `## Code`, `## References`, `## Related` — none of which are
enforced, but all of which make AI parsing trivial.

## Adding a new entry

Two paths:

1. **Script** — fastest:
   ```sh
   ./scripts/new-entry.sh knowledge technology/ai "How prompt caching works"
   ```
   The script picks the right template, fills `title`/`category`/`created`,
   and drops the file in the right folder.

2. **Manual** — copy any file in `_templates/` into the appropriate
   `_knowledge/<category>/` folder, rename it to
   `YYYY-MM-DD-slug.md`, and edit.

See [Contributing](https://github.com/bkalwoda/memory/blob/main/CONTRIBUTING.md)
for the full guide.

## How to find things later

- The **Dashboard** shows the 6 most recent entries plus a tag cloud.
- The **Archive** lists every entry chronologically.
- The **Categories** index navigates the hierarchy.
- The **Tags** index is for cross-cutting concerns (a `rust` tag may appear
  in both *Programming* and *Workflows*).
- The **Search** page does full-text Lunr search with category and tag
  filters — usually the fastest way to recover a memory.

## AI-friendliness

This site is deliberately designed so a future Claude session can:

- Parse any entry by reading the frontmatter contract.
- Add new entries by following one of the templates in `_templates/`.
- Find related work via the `tags`, `category`, and `related` fields before
  writing anything new.
- Update an existing entry safely (bump `updated:`, preserve `created:`).

If you're an AI agent reading this: start with `CONTRIBUTING.md` and
`ARCHITECTURE.md`. They contain the full contract.
