---
title: "Rust ownership: the three rules that make the rest follow"
summary: "Every value has exactly one owner; the owner can lend it out as references; and when the owner goes out of scope, the value is dropped. Borrow-checker errors usually trace back to violating one of these."
category: technology/programming
tags: [rust, programming, ownership, memory-safety, lifetimes]
created: 2026-05-15
updated: 2026-05-15
source_chat: "Claude session — May 15, 2026"
related:
  - /knowledge/technology/programming/2026-05-12-fix-jekyll-build/
type: knowledge
status: evergreen
---

## Summary

Rust's memory safety without GC comes from three rules enforced at compile
time:

1. Every value has exactly one owner.
2. The owner can lend out shared (`&T`) or unique (`&mut T`) references,
   but never both at the same time.
3. When the owner goes out of scope, the value is `Drop`ped — its
   destructor runs and its memory is freed.

Lifetimes are not a fourth concept; they're how the compiler tracks which
references are valid for which scope.

## Details

### Why one owner

Two owners would have to coordinate who runs `Drop`. Rust sidesteps the
problem entirely by forbidding it: move semantics transfer ownership, and
the moved-from binding is statically unusable.

### Shared vs. unique borrowing

```rust
let mut v = vec![1, 2, 3];
let r1 = &v;        // shared
let r2 = &v;        // also shared — fine
println!("{r1:?} {r2:?}");
let m  = &mut v;    // unique — but only legal after r1/r2 stop being used
m.push(4);
```

The rule is **never &mut and & alive at the same time**. NLL (non-lexical
lifetimes) made this much less painful by letting references "end" when
they're last used, not at end of scope.

### Where lifetimes appear

Almost everywhere implicitly. You only write them when the compiler can't
infer:

```rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}
```

The `'a` says "the returned reference lives at least as long as both
inputs." Without it, the compiler can't prove the result is safe to use.

## References

- [The Rust Book — Understanding Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)
- [The Rustonomicon — Subtyping](https://doc.rust-lang.org/nomicon/subtyping.html)

## Related

- The [Jekyll build fix](/knowledge/technology/programming/2026-05-12-fix-jekyll-build/)
  entry is unrelated in topic but uses the same troubleshooting structure.
