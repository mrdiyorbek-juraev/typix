# When to Mock

## System Boundaries Only

Mock **external** dependencies — never internal code you control.

| Mock ✅ | Don't Mock ❌ |
|---------|--------------|
| External APIs (payment, email, analytics) | Your own classes/modules |
| Databases / file system | Internal service collaborators |
| Third-party SDKs | Pure functions you wrote |

## Design for Mockability

**Dependency Injection** — pass dependencies in, don't create them internally:

```typescript
// BAD: creates dependency internally — hard to mock
class OrderService {
  async checkout(cart: Cart) {
    const payment = new StripePayment(); // hidden dep
    return payment.charge(cart.total);
  }
}

// GOOD: dependency injected — easy to substitute
class OrderService {
  constructor(private payment: PaymentGateway) {}

  async checkout(cart: Cart) {
    return this.payment.charge(cart.total);
  }
}
```

## SDK-Style Interfaces

Design specific functions per external operation instead of generic fetchers.
Each mock returns one specific shape — no conditional logic needed in test setup:

```typescript
// BAD: generic fetcher requires conditional mocking
const fetcher = vi.fn((url: string) => {
  if (url.includes("/users")) return { users: [...] };
  if (url.includes("/orders")) return { orders: [...] };
});

// GOOD: specific function per operation
const getUsers = vi.fn(() => ({ users: [...] }));
const getOrders = vi.fn(() => ({ orders: [...] }));
```
