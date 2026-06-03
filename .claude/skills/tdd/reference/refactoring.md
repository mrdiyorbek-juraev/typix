# Refactor Candidates

**Only refactor when all tests are GREEN. Never refactor while RED.**

After each TDD cycle, scan for these:

## Duplication → Extract function/class

```typescript
// Before: same logic in two places
function formatUserName(u: User) { return `${u.first} ${u.last}`.trim() }
function formatAuthorName(a: Author) { return `${a.first} ${a.last}`.trim() }

// After: extracted
function formatFullName(first: string, last: string) { return `${first} ${last}`.trim() }
```

## Long methods → Break into private helpers

Keep tests on the **public interface** — private helpers are an implementation detail.

```typescript
// Before: one long public method
class Parser {
  parse(input: string): AST { /* 80 lines */ }
}

// After: private helpers (tests still only call parse())
class Parser {
  parse(input: string): AST {
    const tokens = this.#tokenize(input);
    return this.#buildTree(tokens);
  }
  #tokenize(input: string): Token[] { ... }
  #buildTree(tokens: Token[]): AST { ... }
}
```

## Shallow modules → Combine or deepen

If two small modules are always used together, merge them. If a module exposes too many methods, hide some inside.

## Feature envy → Move logic to where data lives

```typescript
// BAD: OrderService knows too much about Cart internals
class OrderService {
  getTotalWithTax(cart: Cart) {
    return cart.items.reduce((sum, i) => sum + i.price * i.qty, 0) * 1.2;
  }
}

// GOOD: Cart owns its own total
class Cart {
  getTotalWithTax() { return this.#subtotal() * 1.2; }
}
```

## Primitive obsession → Introduce value objects

```typescript
// BAD: stringly-typed
function sendEmail(to: string, from: string) { ... }

// GOOD: domain type prevents arg swap bugs
type EmailAddress = { address: string; name?: string }
function sendEmail(to: EmailAddress, from: EmailAddress) { ... }
```

## Existing code exposed as problematic

New code sometimes reveals that old code has design issues. Address them now while context is fresh — but stay focused on the current feature.
