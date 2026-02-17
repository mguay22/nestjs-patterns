# Builder

## Intent

Separate the construction of a complex object from its representation so that the same construction process can create different representations.

## Problem

E-commerce orders are complex objects with many optional parts: line items, shipping information, discounts, and payment methods. Constructing such an object in one step requires a constructor with numerous parameters, many of which are optional. This leads to telescoping constructors or large configuration objects that are hard to read, easy to misconfigure, and painful to maintain. Worse, certain common order configurations (express shipping, gift orders) are repeated throughout the codebase with slight variations.

## Solution

The Builder pattern provides a fluent, step-by-step API for constructing complex objects. An `OrderBuilder` exposes methods like `addItem()`, `setShipping()`, `applyDiscount()`, and `setPaymentMethod()`, each returning `this` to allow method chaining. A `build()` method finalizes the object and returns the completed `Order`. For common configurations, an `OrderDirector` encapsulates predefined construction sequences (express orders, gift orders) so that clients can create well-known order types in a single call without knowing the construction details.

## Structure

- **Product (Order):** The complex object being constructed. Contains `items`, `shipping`, `discount`, `paymentMethod`, and `total`. Provides a `calculateTotal()` method to compute the final price.
- **Builder (OrderBuilder):** Provides methods to configure each part of the `Order` step by step. Each method returns `this` for fluent chaining. The `build()` method calculates the total, returns the completed order, and resets the builder for reuse.
- **Director (OrderDirector):** Defines static methods for common construction sequences. `createExpressOrder()` builds an order with express shipping and no discount. `createGiftOrder()` builds an order with gift-wrap shipping and a 5% discount.
- **Client (BuilderController):** Accepts order data via HTTP, optionally delegates to the Director for presets, or drives the Builder directly for custom orders.

## E-Commerce Example

This implementation models an **order construction system** for an e-commerce platform. Orders can be built in two ways:

1. **Using presets via the Director** -- The client specifies `preset: "express"` or `preset: "gift"` and the Director handles the construction sequence. Express orders use express shipping with no discount. Gift orders use gift-wrap shipping to a recipient address with a 5% discount.
2. **Custom orders via the Builder directly** -- The client provides all order details (items, shipping, discount, payment method) and the controller drives the Builder step by step.

The `Order` class contains an array of `OrderItem` objects (each with `name`, `price`, and `quantity`), optional `ShippingInfo`, a `discount` percentage, a `paymentMethod` string, and a computed `total`.

| Pattern Role | Implementation |
|---|---|
| Product | `Order` class (with `OrderItem` and `ShippingInfo`) |
| Builder | `OrderBuilder` |
| Director | `OrderDirector` |
| Client | `BuilderController` |

## When to Use

- You need to create objects with many optional or configurable parts and want to avoid constructors with long parameter lists.
- The same construction process should be able to create different representations of the product.
- You have common construction sequences that should be encapsulated and reused (via a Director).
- You want to ensure that the constructed object is always in a valid, complete state by controlling the finalization step.
- You want to make the construction code self-documenting through method names like `addItem()`, `setShipping()`, and `applyDiscount()`.

## When NOT to Use

- When the object is simple and has few fields. A plain constructor or object literal is clearer.
- When immutability is paramount and you want all fields set at once via the constructor. In that case, consider a static factory method or a simple parameter object instead.
- When there is only one possible representation of the product and no predefined construction sequences. The Builder and Director add indirection without benefit.

## NestJS Integration

In NestJS, the `OrderBuilder` is decorated with `@Injectable()` and registered as a provider. Because NestJS providers default to singleton scope, the same builder instance is shared across requests. The builder handles this by resetting its internal state in the `build()` method, returning the completed order and creating a fresh `Order` internally.

Key NestJS integration points:

- **Injectable builder:** The `OrderBuilder` is managed by the NestJS IoC container, so it can easily have dependencies injected into it (e.g., a pricing service, tax calculator) in a more complex implementation.
- **Controller as client:** The controller acts as the client, interpreting the incoming DTO and deciding whether to use the Director or drive the Builder manually.
- **Director as pure logic:** The `OrderDirector` is a plain class with static methods. It does not need to be injectable because it has no dependencies -- it simply orchestrates a builder that is passed to it.

For request-scoped builders, you could switch to `@Injectable({ scope: Scope.REQUEST })` to get a fresh builder per request, eliminating the need for the reset logic in `build()`.

## API Endpoints

### POST /builder/orders

Creates an order using the Builder. Supports three modes: express preset, gift preset, or custom.

**Express order (preset):**

```bash
curl -X POST http://localhost:3000/builder/orders \
  -H "Content-Type: application/json" \
  -d '{
    "preset": "express",
    "items": [
      {"name": "Mechanical Keyboard", "price": 129.99, "quantity": 1},
      {"name": "Mouse Pad", "price": 19.99, "quantity": 2}
    ]
  }'
```

Expected response:

```json
{
  "items": [
    {"name": "Mechanical Keyboard", "price": 129.99, "quantity": 1},
    {"name": "Mouse Pad", "price": 19.99, "quantity": 2}
  ],
  "shipping": {"method": "express", "address": "Default Express Address"},
  "discount": 0,
  "paymentMethod": "credit-card",
  "total": 169.97
}
```

**Gift order (preset):**

```bash
curl -X POST http://localhost:3000/builder/orders \
  -H "Content-Type: application/json" \
  -d '{
    "preset": "gift",
    "items": [
      {"name": "Scented Candle", "price": 24.99, "quantity": 3}
    ],
    "recipientAddress": "456 Elm Street, Springfield"
  }'
```

Expected response:

```json
{
  "items": [
    {"name": "Scented Candle", "price": 24.99, "quantity": 3}
  ],
  "shipping": {"method": "gift-wrap", "address": "456 Elm Street, Springfield"},
  "discount": 5,
  "paymentMethod": "credit-card",
  "total": 71.22
}
```

**Custom order:**

```bash
curl -X POST http://localhost:3000/builder/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"name": "Standing Desk", "price": 499.99, "quantity": 1}
    ],
    "shipping": {"method": "standard", "address": "789 Oak Ave"},
    "discount": 10,
    "paymentMethod": "paypal"
  }'
```

Expected response:

```json
{
  "items": [
    {"name": "Standing Desk", "price": 499.99, "quantity": 1}
  ],
  "shipping": {"method": "standard", "address": "789 Oak Ave"},
  "discount": 10,
  "paymentMethod": "paypal",
  "total": 449.99
}
```

## Key Files

| File | Description |
|---|---|
| `order.ts` | Defines the `Order` class (the Product), `OrderItem` and `ShippingInfo` interfaces, and the `calculateTotal()` method. |
| `order-builder.ts` | The `OrderBuilder` with fluent methods (`addItem`, `setShipping`, `applyDiscount`, `setPaymentMethod`, `build`). |
| `order-director.ts` | The `OrderDirector` with static methods for common order presets (`createExpressOrder`, `createGiftOrder`). |
| `builder.controller.ts` | Controller that accepts order data via POST and delegates to the Director or Builder. |
| `builder.module.ts` | NestJS module that registers the `OrderBuilder` as a provider. |

## Related Patterns

- **Abstract Factory:** Both create complex objects, but Builder constructs them step by step while Abstract Factory creates entire families of products at once. Builder returns the product as the final step; Abstract Factory returns it immediately.
- **Composite:** Builders are often used to construct Composite trees (e.g., building a nested order with sub-orders).
- **Prototype:** An alternative approach where instead of building from scratch, you clone an existing order and modify it. The two patterns can complement each other -- use Prototype for the base and Builder to customize the clone.
