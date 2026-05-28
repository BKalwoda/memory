# Architecture

This document explains *why* the site is built the way it is. For *how* to
add content, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Goals

1. **Durability.** Plain Markdown in a Git repo outlives any SaaS tool.
2. **Zero ongoing cost.** Static site, free GitHub Pages hosting, no
   backend.
3. **AI-friendliness.** A future Claude session can parse, search, and
   extend the knowledge base by reading a single contract file.
4. **Sub-minute entry capture.** The barrier to writing things down must
   be lower than the barrier to forgetting.

## Stack

| Concern         | Choice                              | Why |
|-----------------|-------------------------------------|-----|
| Site generator  | Jekyll 4.x (via `github-pages` gem) | Native GH Pages support, mature, Markdown-first. |
| Theme           | Custom layouts, no parent theme     | Avoids fighting Minima or another theme's defaults; the site is small. |
| Plugins         | GH-Pages whitelist only             | So the legacy "Deploy from branch" path keeps working. |
| Search          | Lunr.js, CDN-loaded                 | Client-side, no backend, no API key. Good enough up to ~1k entries. |
| Styling         | SCSS partials in `_sass/`           | Compiled by Jekyll's built-in Sass; no Node toolchain. |
| JS              | Vanilla, no build step              | Three files, ~6KB total. |
| Deploy          | GitHub Actions (`pages.yml`)        | Decouples from the legacy build path; we control plugins. |

## Why one collection, not many

The site has a single `_knowledge` collection. Subfolders under it mirror
categories — but the **category is set by frontmatter, not by path**.

Tradeoffs:

- **Pro:** Every listing (Recent, Archive, Search, Related, Categories,
  Tags) is one Liquid loop over `site.knowledge`. Adding a category is
  one YAML edit and one folder — no `_config.yml` change.
- **Pro:** Tags are orthogonal to categories. A `rust` tag can appear in
  both *Programming* and *Workflows* with no ceremony.
- **Con:** It's possible to drift — file in `personal/research/` with
  `category: workflows` would be confusing. The folder layout is
  human-navigation only; nothing enforces alignment.
- **Mitigation:** `new-entry.sh` derives the folder from `category`, so
  if you use the script the two stay in sync.

## Why explicit category/tag stubs

GitHub Pages disallows custom generator plugins, so we can't dynamically
generate `/categories/<slug>/` pages from data. Instead, each leaf in
`_data/categories.yml` has a corresponding stub in `pages/categories/`,
and each tag in use has one in `pages/tags/`.

This is the standard GH-Pages-safe pattern and it has one ongoing cost:
when you introduce a new tag, you must add a stub for it. The
`CONTRIBUTING.md` doc says so, the `new-entry.sh` script reminds you on
exit. A future refinement: a GitHub Action that diffs the commit and
auto-PRs missing stubs.

## Search index

`search.json` is Liquid-rendered at build time from `site.knowledge`. It
contains `{title, url, summary, category, tags, date, body}` per entry,
with body truncated to 2000 chars (Lunr is bottlenecked on index size,
not retrieval quality).

`assets/js/search.js` lazy-loads Lunr from a CDN only on `/search/`,
builds the index in-memory, and renders results. Field boosts:

```
title^10  tags^5  summary^3  category^2  body^1
```

The "type the start of a word" experience is good. For partial-token
search beyond the leading edge, we'd need a custom tokenizer; if the
collection grows past ~500 entries and that becomes painful, switch to
[MiniSearch](https://github.com/lucaong/minisearch).

## Theme strategy

Theme is set on `<html data-theme="...">` so CSS variables cascade
naturally. The "no FOUC" inline script in `_includes/head.html` reads
`localStorage` before paint; without it the page would flash from light
to dark on dark-preference systems. The full toggle JS only attaches the
click handler.

Color palette uses `color-mix(in srgb, …)` for derived shades. That's a
2023+ baseline (`Baseline 2024` per MDN); fine for our audience.

## Frontmatter as the AI contract

`CONTRIBUTING.md` is the single source of truth for the frontmatter
schema. Templates in `_templates/` are the canonical *shapes*; the
schema itself is documented in prose.

Why expose the schema so prominently? Because the value of this site
compounds when a future AI session can:

- Read an entry and know what to expect (`type`, `status`, `category`).
- Add an entry without inventing structure.
- Find related work via `tags` + `category` + `related` rather than
  guessing.
- Update an entry safely (bump `updated:`, keep `created:` and `tags:`).

If a model changes the schema, it should update `CONTRIBUTING.md` in
the same commit.

## Performance notes

- The dashboard does a few Liquid loops at build time (tag aggregation,
  recent sort). At 100 entries this is <0.1s; at 10k it would matter.
- The search index is loaded once per session and cached by the
  browser. At 100 entries it's ~30KB gzipped.
- No client-side framework. The site is ~3 HTTP requests for a cold
  load: HTML, CSS, theme.js. The search page adds Lunr from CDN.

## Non-goals

- **Multiple authors.** This is a personal vault; PR workflows are
  optional and not required to scale.
- **Editor experience.** No CMS, no Netlify Identity. The text editor is
  the editor.
- **Live preview from chat.** Out of scope until import tooling exists.
- **Auth.** The site is public.

## Future work

- An import script that takes a Claude conversation and emits a draft
  entry, with `status: draft`.
- A weekly review page that surfaces drafts and stale evergreens.
- A GitHub Action that auto-creates tag stubs on PR.
- Backlinks (which entries reference *this* one). Possible via a Liquid
  reverse-lookup over `related:`.
