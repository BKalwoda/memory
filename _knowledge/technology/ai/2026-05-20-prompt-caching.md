---
title: "How Claude prompt caching actually works"
summary: "Anthropic's prompt caching reuses prefix tokens at ~10% the input cost when a cached prefix is hit within 5 minutes. Worth it when the prefix is large (>1k tokens) and reused at least 2-3 times."
category: technology/ai
tags: [ai, anthropic, prompt-caching, claude, llm]
created: 2026-05-20
updated: 2026-05-22
source_chat: "Claude session — May 20, 2026"
related:
  - /knowledge/personal/projects/2026-04-30-memory-site/
type: knowledge
status: evergreen
---

## Summary

Prompt caching lets a Claude API call mark the front of its messages list as
*cacheable*. On a subsequent call within the TTL (5 minutes default,
extendable to 1 hour), if the cached prefix is byte-identical, Anthropic
serves it from cache at ~10% of the normal input token cost. Cache writes
themselves cost ~25% more than uncached input, so the breakeven is roughly
two hits.

## Details

The mechanic is a `cache_control: { type: "ephemeral" }` annotation on a
content block in the messages list. Anthropic hashes the prefix up to and
including that block. Up to four cache breakpoints can be marked per
request, and the cache is keyed per-account, per-model, and per-system-prompt.

When to reach for it:

- **System prompts longer than ~1k tokens** reused across many calls (an
  agent loop, an evaluation harness, a chat with a fixed persona).
- **Large reference documents** included in context (codebases, RAG with
  static corpora, transcripts).
- **Few-shot example blocks** that don't change between calls.

When to skip it:

- Single-shot calls.
- Highly variable prefixes (different per call).
- Prefixes below ~1k tokens — the breakeven moves out beyond useful reuse.

The cache itself is best-effort: a cold cache, a model change, or a content
change before the cache breakpoint invalidates the entry. Treat it as a
performance optimization, not a correctness guarantee.

## Code

```python
import anthropic

client = anthropic.Anthropic()
SYSTEM_PROMPT = open("system.md").read()  # large, stable

resp = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": SYSTEM_PROMPT,
            "cache_control": {"type": "ephemeral"},
        }
    ],
    messages=[
        {"role": "user", "content": "Summarise the spec."}
    ],
)

# Usage block reports cache_creation_input_tokens / cache_read_input_tokens
print(resp.usage)
```

## References

- [Anthropic — Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)

## Related

- See [Memory site project](/knowledge/personal/projects/2026-04-30-memory-site/) — this
  KB itself could benefit from prompt caching if a future agent loads many
  entries into context.
