#!/usr/bin/env bash
#
# new-entry.sh — scaffold a new knowledge entry from a template.
#
# Usage:
#   ./scripts/new-entry.sh <type> <category/path> "Title in quotes"
#
# Examples:
#   ./scripts/new-entry.sh knowledge technology/ai "How prompt caching works"
#   ./scripts/new-entry.sh project   personal/projects "Memory site"
#   ./scripts/new-entry.sh workflow  workflows        "PR review checklist"
#
# Types map to files in _templates/:
#   knowledge       -> _templates/knowledge-entry.md
#   project         -> _templates/project-summary.md
#   research        -> _templates/research-summary.md
#   troubleshooting -> _templates/troubleshooting.md
#   workflow        -> _templates/workflow.md

set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <type> <category/path> \"Title\"" >&2
  echo "Types: knowledge | project | research | troubleshooting | workflow" >&2
  exit 1
fi

TYPE="$1"
CATEGORY="$2"
TITLE="$3"

case "$TYPE" in
  knowledge)       TEMPLATE="_templates/knowledge-entry.md" ;;
  project)         TEMPLATE="_templates/project-summary.md" ;;
  research)        TEMPLATE="_templates/research-summary.md" ;;
  troubleshooting) TEMPLATE="_templates/troubleshooting.md" ;;
  workflow)        TEMPLATE="_templates/workflow.md" ;;
  *)
    echo "Unknown type: $TYPE" >&2
    echo "Valid types: knowledge | project | research | troubleshooting | workflow" >&2
    exit 1
    ;;
esac

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE_PATH="$REPO_ROOT/$TEMPLATE"

if [[ ! -f "$TEMPLATE_PATH" ]]; then
  echo "Template not found: $TEMPLATE_PATH" >&2
  exit 1
fi

# Slugify the title: lowercase, non-alnum -> dash, collapse, trim
slugify() {
  printf '%s' "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g'
}

SLUG="$(slugify "$TITLE")"
TODAY="$(date +%Y-%m-%d)"
DEST_DIR="$REPO_ROOT/_knowledge/$CATEGORY"
DEST="$DEST_DIR/${TODAY}-${SLUG}.md"

mkdir -p "$DEST_DIR"

if [[ -e "$DEST" ]]; then
  echo "Refusing to overwrite existing file: $DEST" >&2
  exit 1
fi

# Substitute title, category, and dates into the template's frontmatter.
# We use awk so this works portably (no GNU sed -i required).
awk -v title="$TITLE" -v cat="$CATEGORY" -v today="$TODAY" '
BEGIN { in_fm = 0; fm_count = 0 }
/^---[[:space:]]*$/ {
  fm_count++
  if (fm_count == 1) in_fm = 1
  else if (fm_count == 2) in_fm = 0
  print; next
}
in_fm && /^title:/    { print "title: \"" title "\""; next }
in_fm && /^category:/ { print "category: " cat;       next }
in_fm && /^created:/  { print "created: " today;      next }
in_fm && /^updated:/  { print "updated: " today;      next }
{ print }
' "$TEMPLATE_PATH" > "$DEST"

echo "Created: ${DEST#$REPO_ROOT/}"
echo
echo "Next:"
echo "  1. Edit the file and fill in summary, tags, body."
echo "  2. If you used a new tag, create pages/tags/<tag>.md as a stub."
echo "  3. bundle exec jekyll serve to preview."
