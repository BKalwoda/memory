# Memory

A personal knowledge vault, built with Jekyll. A place to keep the distilled
output of long conversations — summaries, decisions, code snippets, research
notes, workflows — and find it again later.

The site is intentionally static, plain-Markdown, and hosted on GitHub Pages
so it survives without ongoing maintenance.

## Quickstart

```sh
# Local development
bundle install
bundle exec jekyll serve
# → http://127.0.0.1:4000

# Add a new entry from a template
./scripts/new-entry.sh knowledge technology/ai "How prompt caching works"
```

## What's in the box

- **Dashboard** at `/` — recent entries, category tiles, tag cloud.
- **Search** at `/search/` — full-text (Lunr.js), with category and tag filters.
- **Archive** at `/archive/` — every entry, reverse-chronological, grouped by month.
- **Categories** at `/categories/` — the full tree.
- **Tags** at `/tags/` — weighted cloud of every tag in use.
- **Light/dark theme** — respects system preference, override persists in
  `localStorage`.
- **Related entries** — on every entry page; combines manual cross-links
  with tag-based suggestions.

## Folder layout

```
_config.yml              Site configuration.
_data/categories.yml     Category tree. Edit this to add a category.
_data/navigation.yml     Top-nav links.

_knowledge/              All content. One folder per category.
  technology/ai/...
  technology/programming/...
  personal/research/...
  personal/projects/...
  ideas/
  workflows/
  philosophy/

_layouts/                Page shells: default, home, entry, category, tag, page.
_includes/               Reusable HTML fragments.
_sass/                   Styles. Split per concern (typography, layout, …).

assets/
  css/main.scss          Imports everything in _sass/.
  js/theme.js            Light/dark toggle, mobile nav.
  js/search.js           Lunr index + UI.
  js/filters.js          Listing-page chip filters.

pages/                   Top-level site pages.
  index.md               Dashboard.
  search.md              Search UI.
  archive.md             Chronological archive.
  categories.md          Category index.
  tags.md                Tag index.
  about.md               About page.
  categories/*.md        One stub per category (powers listing layout).
  tags/*.md              One stub per tag in use.

_templates/              Templates for new entries. See CONTRIBUTING.md.
scripts/new-entry.sh     Scaffolds a dated entry from a template.

search.json              Liquid-generated search index consumed by search.js.
```

## Adding an entry

Two paths. Both produce the same thing.

### Script

```sh
./scripts/new-entry.sh <type> <category/path> "Title"
```

`<type>` picks the template:

| Type              | Template                          |
|-------------------|-----------------------------------|
| `knowledge`       | `_templates/knowledge-entry.md`   |
| `project`         | `_templates/project-summary.md`   |
| `research`        | `_templates/research-summary.md`  |
| `troubleshooting` | `_templates/troubleshooting.md`   |
| `workflow`        | `_templates/workflow.md`          |

The script slugs the title, prepends today's date, and drops the file in
`_knowledge/<category>/YYYY-MM-DD-slug.md` with `title`, `category`, and
`created` pre-filled.

### Manual

Copy any file in `_templates/` into the appropriate folder, rename it to
`YYYY-MM-DD-slug.md`, and edit. If you use a new tag, add a stub at
`pages/tags/<tag>.md` (copy any existing one in that folder).

The full frontmatter schema and body conventions are in
[CONTRIBUTING.md](CONTRIBUTING.md).

## Deploying to GitHub Pages

The repo includes `.github/workflows/pages.yml`, which builds with the
official Pages Action. To enable it:

1. Push to `main`.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The next push deploys automatically.

If you prefer the legacy "Deploy from branch" path, that also works —
the `Gemfile` pins `github-pages` and uses only whitelisted plugins.

## Why this exists

See [ARCHITECTURE.md](ARCHITECTURE.md) for the design rationale (single
collection, Lunr over Algolia, GH-Pages constraints, AI-friendliness
contract, etc.).
