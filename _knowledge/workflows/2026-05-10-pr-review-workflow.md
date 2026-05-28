---
title: "PR review workflow — the order that catches the most"
summary: "Read the PR description first, then the tests, then the diff bottom-up. Catches scope creep and missing tests faster than diff-first reading."
category: workflows
tags: [workflow, pr-review, code-review, git]
created: 2026-05-10
updated: 2026-05-10
type: workflow
status: evergreen
related:
  - /knowledge/personal/projects/2026-04-30-memory-site/
---

## When to use this

Any PR over ~50 lines where you're not already the author. Below that
threshold, just read the diff top-to-bottom.

## Steps

1. **Read the PR description.** What is this trying to do? If you can't
   restate it in one sentence, ask before reviewing — you'll waste
   everyone's time otherwise.
2. **Look at the test diff first.** Tests tell you what behavior the
   author thinks they changed. Tests that *aren't* there tell you about
   gaps in their mental model.
3. **Read the diff bottom-up.** The bottom of a diff is usually leaf
   code — easier to reason about in isolation. Read up the call stack so
   that by the time you hit the top-level changes, you already know
   what's underneath.
4. **Run the tests locally** if the PR touches anything you care about.
   CI green isn't the same as "I believe it."
5. **Skim for scope.** Anything outside the description? Flag it as a
   separate PR.
6. **Write the review.** Group comments: blocking, nit, question. Praise
   one specific thing if it deserves it.

## Tools

- `gh pr checkout <num>` — local clone of the branch.
- `git diff --stat origin/main...HEAD` — quick view of churn.
- Editor's "go to definition" — chasing call sites in 5 seconds beats
  reading a 200-line review for 20 minutes.

## Pitfalls

- **Top-down diff reading.** You think you'll absorb context; you don't —
  you just normalize whatever the diff shows you.
- **"LGTM" with no questions.** If the PR is non-trivial and you have no
  questions, you probably didn't read it.
- **Bikeshedding the comments instead of the code.** Style nits are real
  but should be deprioritized.

## Variations

- For tiny PRs, just read it top-down. The structure overhead isn't
  worth it.
- For *huge* PRs (>500 lines), insist on a split. The cost of reviewing
  it well is more than the cost of the author breaking it up.
