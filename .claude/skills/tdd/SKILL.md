---
name: tdd
description: Test-driven development with red-green-refactor loop. Use when user wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants integration tests, or asks for test-first development.
---

This skill enforces **vertical slicing** with red-green-refactor cycles.

> ONE test → ONE implementation → repeat

## Pre-Implementation Planning

Before writing any code, address these questions with the user:

1. **Interface changes** — What public API needs to change or be created?
2. **Behavioral priorities** — Which behaviors matter most? Order them.
3. **Deep modules** — Can the design hide complexity behind a small interface?
4. **Testability** — How will dependencies be injected to make the code testable?

Get approval before starting the loop.

## The Red-Green-Refactor Loop

### 🔴 RED — Write one failing test

- Test only through the **public interface**
- Describe **what** the system does, not **how**
- Run the test and confirm it fails for the right reason
- One logical assertion per test

```typescript
// GOOD: Tests observable behavior
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

### 🟢 GREEN — Implement the minimum code to pass

- Write only enough code to make that one test pass
- No speculative features, no future-proofing
- It's okay to be "wrong" — correctness emerges through the loop

### 🔵 REFACTOR — Clean up (only when all tests are green)

**Never refactor while RED.**

Look for:
- **Duplication** → Extract function/class
- **Long methods** → Break into private helpers (keep tests on public interface)
- **Shallow modules** → Combine or deepen
- **Feature envy** → Move logic to where data lives
- **Primitive obsession** → Introduce value objects

Then repeat the loop with the next behavior.

---

## Good vs. Bad Tests

→ *See [tests reference](reference/tests.md) for detailed examples.*

**Good tests** — describe behavior through public interfaces:
- Survive internal refactors unchanged
- Read like specifications
- Test WHAT, not HOW

**Bad tests** — coupled to implementation details:
- Mock internal collaborators
- Assert on call counts or order
- Break when you refactor without changing behavior

## When to Mock

→ *See [mocking reference](reference/mocking.md)*

Mock **only** at system boundaries:
- External APIs (payment, email, analytics)
- Databases / file system

**Never mock** your own classes or internal modules you control. Use dependency injection to pass real or fake implementations in.

## Interface Design

→ *See [interface design reference](reference/interface-design.md) and [deep modules reference](reference/deep-modules.md)*

Design for testability from the start:
- **Accept dependencies, don't create them** (dependency injection)
- **Return results, don't produce side effects** (pure functions where possible)
- **Minimize surface area** — fewer methods, simpler parameters

## Quality Checklist (per cycle)

Before moving to the next test, verify:

- [ ] Test describes behavior, not implementation
- [ ] Test uses only public interfaces
- [ ] Test will survive internal refactors
- [ ] Code is minimal — only what the current test requires
- [ ] No speculative features added
- [ ] All prior tests still pass
