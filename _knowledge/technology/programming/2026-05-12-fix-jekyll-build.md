---
title: "Fix: Jekyll build fails with 'Liquid syntax error: Unknown tag' on GitHub Pages"
summary: "GitHub Pages disables custom Liquid tags by default; the fix is to either avoid the tag or move to Actions-based builds where you control the environment."
category: technology/programming
tags: [jekyll, github-pages, troubleshooting, debugging, build]
created: 2026-05-12
updated: 2026-05-12
type: troubleshooting
status: evergreen
related:
  - /knowledge/personal/projects/2026-04-30-memory-site/
excerpt_separator: ""
---

{% raw %}
## Symptom

```
Liquid Exception: Liquid syntax error (line 12): Unknown tag 'highlight_file'
in /pages/about.md
```

Local `bundle exec jekyll build` succeeded. GitHub Pages build failed with
the above. The site went down because Pages refused to deploy the previous
revision after an attempted update.

## Root cause

`{% highlight_file ... %}` was a custom plugin from a third-party Jekyll
gem. The `github-pages` gem [whitelists a fixed plugin set](https://pages.github.com/versions/);
custom plugins are silently dropped during Pages' build, and Liquid then
hits the unknown tag and fails.

The local build worked because the gem was in the `Gemfile` and Jekyll
loaded it. The Pages build doesn't honor non-whitelisted gems.

## Fix

Two options. We chose option 2.

```diff
- {% highlight_file _includes/frontmatter-schema.html %}
+ {% include frontmatter-schema.html %}
```

**Option 1: avoid the plugin.** Replace the custom tag with a built-in
mechanism. In this case `{% include %}` plus pre-rendered HTML inside the
include works fine.
{% endraw %}

**Option 2: switch to Actions-based deploy.** Use
`actions/jekyll-build-pages` (or a bundle-exec build step) so we control
which plugins load. Pages then deploys an arbitrary artifact rather than
running its own build:

```yaml
- name: Build with Jekyll
  run: bundle exec jekyll build
- uses: actions/upload-pages-artifact@v3
```

## Prevention

- Pin to the `github-pages` gem in the `Gemfile` for the legacy build path,
  so local builds fail the same way Pages will fail.
- When adding a new gem or plugin, check
  [pages.github.com/versions](https://pages.github.com/versions/) first.
- If we want any plugin freedom at all, commit to the Actions-based
  deploy from day one — half-in is the worst of both.

## References

- [GitHub Pages — Dependency versions](https://pages.github.com/versions/)
- [actions/jekyll-build-pages](https://github.com/actions/jekyll-build-pages)
