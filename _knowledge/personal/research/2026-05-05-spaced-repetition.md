---
title: "Spaced repetition: what actually works for adult learning"
summary: "Anki-style spaced repetition still has the strongest evidence base for fact retention, but only when cards are atomic and self-authored. For procedural skills, retrieval practice + interleaving beats SRS."
category: personal/research
tags: [research, learning, spaced-repetition, memory]
created: 2026-05-05
updated: 2026-05-05
source_chat: "Claude session — May 5, 2026"
type: research
status: evergreen
---

## Question

For an adult trying to retain technical knowledge over years (not for an
exam), what study habits actually move the needle?

## Findings

The literature converges on three robust effects:

1. **Spacing.** Reviewing material over expanding intervals beats massed
   practice for long-term retention. Cepeda et al. (2008) showed the
   optimal review gap scales with the desired retention interval — about
   10–20% of it.
2. **Retrieval practice (the testing effect).** Producing the answer from
   memory is far more effective than rereading. Roediger & Karpicke (2006)
   is the canonical reference; the effect is huge and replicates well.
3. **Interleaving.** Mixing related-but-different problems beats blocking
   identical ones for transfer, though it feels harder during the
   session — students consistently rate it as less effective even when
   it works better (Kornell & Bjork, 2008).

For *facts* (vocab, syntax, function signatures, names), Anki-style SRS
that combines all three is near-optimal — but only if cards are:

- atomic (one fact per card),
- self-authored (the act of formulating the card *is* part of the
  learning),
- and reviewed daily for at least 5 minutes.

For *procedural skills* (writing code, debugging, design), retrieval
practice in the form of "do the thing without notes" plus interleaved
problem sets dominates. SRS cards can scaffold but won't substitute.

## Confidence

High on (1)–(3) — they're among the most replicated findings in
educational psychology. Medium on the procedural-vs-declarative split;
the lab-to-life transfer evidence is thinner.

What would change my mind: a well-powered study showing that *passive*
review beats SRS for typical adult learners over a 1-year retention
interval. I'm not aware of one.

## Open threads

- Does SRS lose ground to LLM-augmented "lookup on demand"? In practice
  the cards I never review aren't recalled, regardless of whether the
  lookup is fast.
- Effect of sleep on the spacing interval — there are hints that
  cross-night gaps are disproportionately valuable.

## References

- Cepeda, N. J. et al. (2008). *Spacing effects in learning: A temporal
  ridgeline of optimal retention.* Psychological Science.
- Roediger, H. L. & Karpicke, J. D. (2006). *Test-enhanced learning.*
  Psychological Science.
- Kornell, N. & Bjork, R. A. (2008). *Learning concepts and categories.*
  Psychological Science.
