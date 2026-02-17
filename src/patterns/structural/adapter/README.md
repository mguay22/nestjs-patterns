# Adapter Pattern

## Intent

Convert the interface of a class into another interface clients expect, letting classes work together that could not otherwise because of incompatible interfaces.

## Problem

In an e-commerce platform, you need to integrate with multiple third-party payment gateways -- Stripe and PayPal -- each with its own proprietary API. Stripe expects amounts in cents and returns a `status` field, while PayPal expects amounts as formatted strings and returns a `state` field. Without an abstraction layer, your application code becomes tightly coupled to each gateway's specific API, making it difficult to add new providers or swap them out.

## Solution

The Adapter pattern wraps each third-party API behind a common `PaymentGateway` interface. Each adapter translates calls from the unified interface into the format expected by the specific API. The application code only interacts with the `PaymentGateway` interface, remaining unaware of the differences between Stripe and PayPal under the hood.

## Structure

- **Target Interface** (`PaymentGateway`): Defines the uniform `charge(amount, currency)` method that the client expects.
- **Adaptees** (`StripeApi`, `PayPalApi`): The existing third-party classes with incompatible interfaces. `StripeApi.createCharge()` takes cents and returns `{ id, status, amount }`. `PayPalApi.makePayment()` takes a string total and returns `{ paymentId, state }`.
- **Adapters** (`StripeAdapter`, `PayPalAdapter`): Implement `PaymentGateway` and internally delegate to their respective adaptee, translating parameters and return values.
- **Client** (`AdapterController`): Uses only the `PaymentGateway` interface, selecting the appropriate adapter at runtime based on the request.

## E-Commerce Example

This implementation models a payment processing system that supports multiple gateways. The `StripeApi` class simulates Stripe's API, which expects amounts in cents (e.g., `$29.99` becomes `2999`) and returns a charge object with an `id` and `status`. The `PayPalApi` class simulates PayPal's API, which expects a string total (e.g., `"29.99"`) and returns an object with `paymentId` and `state`.

The `StripeAdapter` converts dollars to cents before calling `StripeApi.createCharge()`, then maps the result to a `PaymentResult`. The `PayPalAdapter` formats the amount as a fixed-decimal string before calling `PayPalApi.makePayment()`, then maps `state === 'approved'` to `success: true`.

The controller stores both adapters in a `gateways` record keyed by name, selecting the correct one at runtime based on the `gateway` field in the request body.

## When to Use

- You need to integrate third-party libraries or services whose interfaces do not match your application's expected interface.
- You want to decouple your business logic from specific external API implementations so you can swap providers without modifying client code.
- You are consolidating multiple legacy systems that perform similar functions but expose different APIs.
- You want to write tests against an interface rather than a concrete external dependency.
- You are building a plugin architecture where new implementations must conform to a standard contract.

## When NOT to Use

- The external API already matches your expected interface -- adding an adapter would be unnecessary indirection.
- You control both the client and the service code and can simply refactor the service to match the expected interface directly.
- The differences between APIs are so extensive that an adapter becomes a full translation layer with significant business logic, at which point a different pattern (such as Anti-Corruption Layer) may be more appropriate.

## NestJS Integration

Each adaptee (`StripeApi`, `PayPalApi`) and each adapter (`StripeAdapter`, `PayPalAdapter`) is registered as a NestJS `@Injectable()` provider. The adapters receive their adaptees via constructor injection, which NestJS resolves automatically through its dependency injection container. The module exports the adapters so other modules can depend on the `PaymentGateway` interface without knowing about the underlying APIs.

## API Endpoints

### POST /adapter/payments

Process a payment through either Stripe or PayPal.

**Request:**

```bash
curl -X POST http://localhost:3000/adapter/payments \
  -H "Content-Type: application/json" \
  -d '{"gateway": "stripe", "amount": 49.99, "currency": "USD"}'
```

**Response:**

```json
{
  "success": true,
  "transactionId": "stripe_ch_1700000000000",
  "gateway": "stripe"
}
```

**Request (PayPal):**

```bash
curl -X POST http://localhost:3000/adapter/payments \
  -H "Content-Type: application/json" \
  -d '{"gateway": "paypal", "amount": 49.99, "currency": "USD"}'
```

**Response:**

```json
{
  "success": true,
  "transactionId": "paypal_1700000000000",
  "gateway": "paypal"
}
```

**Error (unknown gateway):**

```bash
curl -X POST http://localhost:3000/adapter/payments \
  -H "Content-Type: application/json" \
  -d '{"gateway": "venmo", "amount": 49.99, "currency": "USD"}'
```

```json
{
  "statusCode": 400,
  "message": "Unknown gateway: venmo. Valid gateways: stripe, paypal"
}
```

## Key Files

| File | Description |
|------|-------------|
| `payment-gateway.interface.ts` | Defines the `PaymentGateway` target interface and `PaymentResult` type |
| `stripe-api.ts` | Simulates the Stripe third-party API (adaptee) |
| `paypal-api.ts` | Simulates the PayPal third-party API (adaptee) |
| `stripe.adapter.ts` | Adapts `StripeApi` to the `PaymentGateway` interface |
| `paypal.adapter.ts` | Adapts `PayPalApi` to the `PaymentGateway` interface |
| `adapter.controller.ts` | REST controller that selects the adapter based on request input |
| `adapter.module.ts` | NestJS module registering all providers and exports |

## Related Patterns

- **Bridge**: While Adapter makes two existing incompatible interfaces work together, Bridge separates an abstraction from its implementation upfront so that both can vary independently. Adapter is typically applied after the fact; Bridge is designed in from the start.
- **Facade**: Facade defines a new, simplified interface over a complex subsystem, whereas Adapter reuses an existing interface. Adapter wraps one object; Facade may wrap an entire subsystem of objects.
- **Decorator**: Decorator wraps an object to add behavior without changing its interface, while Adapter wraps an object specifically to change its interface.
