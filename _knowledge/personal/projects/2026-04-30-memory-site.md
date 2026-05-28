---
title: "Memory site — a personal knowledge vault"
summary: "A static Jekyll site that acts as a long-term memory for distilled Claude conversations. Built for durability, AI-parseability, and zero ongoing cost."
category: personal/projects
tags: [project, jekyll, knowledge-management, memory]
created: 2026-04-30
updated: 2026-05-28
type: project
status: evergreen
related:
  - /knowledge/technology/ai/2026-05-20-prompt-caching/
  - /knowledge/workflows/2026-05-10-pr-review-workflow/
action_items:
  - "Add an /imports endpoint or script that converts chat transcripts to entries."
  - "Experiment with prompt caching when an agent loads many entries into context."
---

## Goal

A site I can keep returning to for years that holds the *distilled* output of
conversations with Claude (and elsewhere) — not transcripts, but the
load-bearing summaries, decisions, and snippets. Optimized for:

- Adding a new entry in under a minute.
- Finding any past entry in under ten seconds.
- An AI agent reading the schema and adding an entry without prompting.

## Status

**Shipped initial version.** Custom Jekyll layouts, Lunr-based search,
light/dark theme, frontmatter contract documented in CONTRIBUTING and
ARCHITECTURE, six example entries, GitHub Pages deploy via Actions.

## Decisions

- **Single Jekyll collection** (`_knowledge/`) with subfolders for
  categories, rather than one collection per category. Keeps Liquid loops
  uniform and avoids `_config.yml` churn when adding categories.
- **GH-Pages-compatible plugin set only.** No custom generators — category
  and tag pages are explicit stubs in `pages/categories/` and
  `pages/tags/`. Trades a small amount of repetition for being able to
  rely on vanilla `github-pages` builds.
- **Lunr over Algolia.** Algolia is faster but requires an account + index
  sync. Lunr ships with the static site and works offline.
- **Frontmatter as the AI contract.** Everything an agent needs to know is
  in `CONTRIBUTING.md`. Templates in `_templates/` are the canonical
  shapes.

## Open questions

- Should `related:` accept *titles* in addition to permalinks, so a fuzzy
  agent can cross-link without resolving URLs first? Probably yes,
  resolved at build via a Liquid lookup.
- Auto-generated tag stubs are still a manual step. A GH Action could
  inspect the diff and create stubs on PR — not worth it until tag count
  grows past ~30.

## Next steps

- [ ] Import script: paste a chat transcript, get a draft entry.
- [ ] Lighthouse run on a populated site (current entries are sparse).
- [ ] Consider a `weekly-review` page that surfaces stale `status: draft`
      entries.

## References

- This very entry lives at `_knowledge/personal/projects/2026-04-30-memory-site.md`.
- See [How prompt caching works](/knowledge/technology/ai/2026-05-20-prompt-caching/).
