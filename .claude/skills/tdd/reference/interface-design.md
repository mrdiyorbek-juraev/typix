# Interface Design for Testability

## Three Core Principles

### 1. Dependency Injection — Accept dependencies, don't create them

```typescript
// BAD: hidden dependency
class CheckoutService {
  async checkout(cart: Cart) {
    const gateway = new StripeGateway(); // untestable
    return gateway.charge(cart.total);
  }
}

// GOOD: injectable dependency
class CheckoutService {
  constructor(private gateway: PaymentGateway) {}

  async checkout(cart: Cart) {
    return this.gateway.charge(cart.total);
  }
}
```

In tests, pass a fake/stub instead of the real gateway.

### 2. Pure Functions — Return results, don't produce side effects

```typescript
// BAD: side effect — hard to verify
function applyDiscount(cart: Cart, code: string): void {
  cart.total = cart.total * 0.9; // mutates in place
}

// GOOD: pure — trivial to assert
function calculateDiscount(total: number, code: string): number {
  return total * 0.9;
}
```

Pure functions need no setup or teardown. Assert the return value.

### 3. Minimal Interface Complexity

Fewer methods + simpler parameters = fewer test cases needed.

Ask before exposing each method:
- Can this be merged with an existing method?
- Can parameters be combined into a single options object?
- Can this complexity be hidden inside the implementation?

```typescript
// BAD: 3 methods that could be 1
interface Formatter {
  formatDate(d: Date): string;
  formatDateShort(d: Date): string;
  formatDateLong(d: Date): string;
}

// GOOD: 1 method, complexity inside
interface Formatter {
  formatDate(d: Date, style?: "short" | "long"): string;
}
```
