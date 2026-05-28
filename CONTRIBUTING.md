# Contributing to Memory

This document is the contract for adding and editing entries — both for a
human author and for an AI agent operating on the repo. If you change the
schema, update this file.

## The frontmatter schema

Every file in `_knowledge/` carries this YAML block at the top. Required
fields are marked **required**; optional fields can be omitted entirely.

```yaml
---
title: "Human-readable title"                                # required
summary: "One-to-three sentence summary."                    # required
category: technology/programming                             # required; must match a slug in _data/categories.yml
tags: [tag-a, tag-b]                                         # required (use [] if truly none)
created: 2026-05-15                                          # required, YYYY-MM-DD
updated: 2026-05-20                                          # optional; defaults to created
source_chat: "Claude session — May 15, 2026"                 # optional
related:                                                     # optional list of permalinks
  - /knowledge/technology/programming/lifetimes/
type: knowledge                                              # required; one of below
status: evergreen                                            # required; one of below
action_items:                                                # optional
  - "Action 1"
---
```

### Allowed values

- `type`: `knowledge` | `project` | `research` | `troubleshooting` | `workflow`
- `status`: `draft` | `evergreen` | `archived`
- `category`: any slug listed in `_data/categories.yml` (top-level or child).

### File naming

`_knowledge/<category-path>/YYYY-MM-DD-slug.md`. The date is the creation
date. The slug is kebab-case, derived from the title.

Examples:

- `_knowledge/technology/ai/2026-05-20-prompt-caching.md`
- `_knowledge/workflows/2026-05-10-pr-review-workflow.md`

## Body conventions

The body is Markdown. Use ATX headings (`##`). The following sections are
*conventional but not enforced* — stick to them so future searches and AI
parses are predictable.

For `type: knowledge`:

```markdown
## Summary
## Details
## Code        (optional)
## References  (optional)
## Related     (optional, in addition to frontmatter `related:`)
```

For `type: project` — see `_templates/project-summary.md`. Sections:
Goal, Status, Decisions, Open questions, Next steps, References.

For `type: research` — see `_templates/research-summary.md`. Sections:
Question, Findings, Confidence, Open threads, References.

For `type: troubleshooting` — see `_templates/troubleshooting.md`.
Sections: Symptom, Root cause, Fix, Prevention, References.

For `type: workflow` — see `_templates/workflow.md`. Sections: When to
use, Steps, Tools, Pitfalls, Variations.

## Tag hygiene

- Use **lowercase**, kebab-case (e.g. `prompt-caching`, not `Prompt Caching`).
- Prefer existing tags. Skim `/tags/` before inventing a new one.
- Keep tags noun-like and topical. Avoid `interesting`, `important`,
  `todo` — use `status: draft` for the last.
- When you add a brand-new tag, create a stub at `pages/tags/<tag>.md` (copy
  any existing file in that folder). The tag-listing page won't render
  without it.

## Adding a category

1. Add it to `_data/categories.yml` (under the right parent, with a
   `slug`, `label`, `description`, `icon`).
2. Create the folder under `_knowledge/`.
3. Create a stub at `pages/categories/<slug-with-dashes>.md` (copy any
   existing one).

## Cross-linking

Two mechanisms:

- **Frontmatter `related:`** — explicit list of permalinks. Renders first
  in the Related box on the entry page.
- **Tag overlap** — automatic. When fewer than 3 manual relateds are
  specified, the entry layout adds the top entries by shared tag count.

Prefer explicit `related:` for important connections. Tag overlap is a
safety net.

## How an AI agent should add an entry

If you are an LLM operating on this repo, follow this exactly:

1. **Search before writing.** Use the existing entries as context.
   Specifically: read `/search.json` or grep the user's intent across
   `_knowledge/`. If a near-duplicate exists, update it instead of
   creating a new file (bump `updated:`, append new content under a new
   `##` subhead).
2. **Pick the right template.** Use `_templates/<type>.md` as the starting
   structure. Don't invent a new section layout unless the existing ones
   don't fit.
3. **Set the schema correctly.**
   - `title`: specific, scannable.
   - `summary`: 1–3 sentences. Will be shown on cards and in search.
   - `category`: must be a slug present in `_data/categories.yml`.
   - `tags`: lowercase kebab-case; reuse existing tags from `/search.json`
     where possible.
   - `created`: today (`date +%F`).
   - `type` and `status` per the allowed values above.
4. **Cross-link.** Set `related:` with permalinks to 1–3 entries that
   share concepts.
5. **If using a new tag**, also create `pages/tags/<tag>.md` (copy an
   existing stub).
6. **Validate by building.** `bundle exec jekyll build --strict_front_matter`
   must succeed.

## Local development

```sh
bundle install
bundle exec jekyll serve
# http://127.0.0.1:4000
```

`--livereload` is supported. Builds are fast (under a second for the
shipped example set).

## Style

- ASCII quotes (not curly) in body text — Markdown renders them safely.
- 80–100 character line width in source.
- No emoji in titles (they break the search index's word boundaries).
- Code blocks must specify a language for syntax highlighting.

## Pull requests

Optional — this is a personal repo. If you do open one, the PR title
should be the entry's title. The PR description can be the entry's
summary.
