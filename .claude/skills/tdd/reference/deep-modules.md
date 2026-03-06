# Deep Modules

From *A Philosophy of Software Design* (John Ousterhout).

## The Ideal: Small Interface + Large Implementation

```
┌──────────────────────────────────┐
│  interface: 2 methods, 1 param   │  ← small
├──────────────────────────────────┤
│                                  │
│   complex internal logic,        │
│   error handling, caching,       │  ← large
│   retries, serialization...      │
│                                  │
└──────────────────────────────────┘
```

Users of a deep module interact through a few simple methods while all complexity is hidden inside.

## The Anti-Pattern: Shallow Modules

```
┌────────────────────────────────────────────────┐
│  interface: 12 methods, 4-7 params each        │  ← large
├────────────────────────────────────────────────┤
│  thin wrapper — barely does anything           │  ← small
└────────────────────────────────────────────────┘
```

Shallow modules leak complexity to callers and make tests hard to write because every test must understand internal wiring.

## Three Questions Before Adding to an Interface

1. **Can the number of methods be reduced?** Merge related methods.
2. **Can parameters be simplified?** Group into an options object, or set smart defaults.
3. **Can additional complexity be hidden inside?** Move decisions inward.

## Example

```typescript
// SHALLOW: leaks complexity, hard to test
interface Cache {
  get(key: string): unknown;
  set(key: string, value: unknown, ttlMs: number): void;
  delete(key: string): void;
  deleteByPattern(pattern: RegExp): void;
  deleteExpired(): void;
  getOrSet(key: string, factory: () => unknown, ttlMs: number): unknown;
  size(): number;
}

// DEEP: hides complexity, one obvious way to use it
interface Cache {
  get<T>(key: string, factory: () => T, ttlMs?: number): T;
  invalidate(key: string | RegExp): void;
}
```

The deep version handles expiry, pattern matching, and lazy loading internally.
Tests only need to verify: "does it return the right value? does invalidate clear it?"
