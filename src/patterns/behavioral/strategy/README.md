# Strategy

## Intent

Define a family of algorithms, encapsulate each one, and make them interchangeable so that the algorithm can vary independently from the clients that use it.

## Problem

An e-commerce platform offers multiple pricing models -- percentage discounts, flat dollar discounts, buy-one-get-one-free deals, and tiered bulk pricing. Embedding all of these calculations in a single pricing service using conditional logic makes the code difficult to extend. Each new promotion type requires modifying existing code, and testing individual strategies in isolation becomes cumbersome.

## Solution

The Strategy pattern extracts each pricing algorithm into its own class that implements a common `PricingStrategy` interface. The `PricingService` holds a reference to the current strategy and delegates price calculations to it. The strategy can be swapped at runtime based on the request, enabling the same service to apply different pricing models without any conditional branching.

## Structure

- **Strategy (interface)** -- `PricingStrategy`: Declares `calculate(basePrice, quantity)` returning a `PricingResult`.
- **Concrete Strategies** -- `PercentageDiscountStrategy`, `FlatDiscountStrategy`, `BogoStrategy`, `TieredPricingStrategy`: Each implements a different pricing algorithm.
- **Context** -- `PricingService`: Holds the current strategy via `setStrategy()` and delegates `calculatePrice()` to it.
- **Client** -- `StrategyController`: Selects and sets the strategy based on the incoming request.

## E-Commerce Example

This implementation provides four interchangeable **pricing strategies**:

1. **PercentageDiscountStrategy** -- Applies a configurable percentage discount to the subtotal. Example: 15% off $100 x 2 = $30 discount.
2. **FlatDiscountStrategy** -- Subtracts a fixed dollar amount from the subtotal (capped at the subtotal to prevent negative prices). Example: $20 flat off $150 = $130.
3. **BogoStrategy** (Buy One Get One Free) -- For every two items, one is free. With 5 items at $10 each, 2 are free, so the final price is $30.
4. **TieredPricingStrategy** -- Applies volume-based discounts: no discount for 1-10 items, 10% off for 11-50 items, 20% off for 50+ items.

The controller maps the `strategy` field in the request body to the appropriate strategy class, sets it on the `PricingService`, and calculates the price. When no strategy is set, the service returns full price with no discount.

## When to Use

- You have multiple algorithms for the same task and need to switch between them at runtime.
- You want to avoid conditional statements that select among algorithms.
- Different clients or contexts require different algorithm variations.
- Algorithm implementations should be independently testable and replaceable.
- You anticipate adding new algorithms in the future without modifying existing code.

## When NOT to Use

- There are only one or two algorithms that rarely change -- a simple conditional is clearer.
- Clients never need to switch algorithms at runtime -- compile-time selection via dependency injection is sufficient.
- The overhead of creating strategy objects for trivial calculations is not justified.

## NestJS Integration

The `PricingService` is an `@Injectable()` service with a mutable `strategy` field that can be set per request. The controller selects the strategy based on the request body, instantiates the appropriate strategy class, and sets it on the service before calculating. The strategy classes are plain TypeScript classes with no NestJS dependencies, keeping them portable and easy to test. The module exports the `PricingService` so other modules can use it with their own strategy selections.

## API Endpoints

### POST /strategy/pricing

Calculates a price using the specified pricing strategy.

**Percentage discount:**

```bash
curl -X POST http://localhost:3000/strategy/pricing \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "percentage",
    "basePrice": 49.99,
    "quantity": 3,
    "discountValue": 15
  }'
```

**Expected response:**

```json
{
  "input": {
    "strategy": "percentage",
    "basePrice": 49.99,
    "quantity": 3,
    "discountValue": 15
  },
  "result": {
    "finalPrice": 127.47,
    "discount": 22.5,
    "strategy": "15% discount"
  }
}
```

**Flat discount:**

```bash
curl -X POST http://localhost:3000/strategy/pricing \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "flat",
    "basePrice": 49.99,
    "quantity": 3,
    "discountValue": 25
  }'
```

**Buy-one-get-one-free:**

```bash
curl -X POST http://localhost:3000/strategy/pricing \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "bogo",
    "basePrice": 10,
    "quantity": 5
  }'
```

**Expected response:**

```json
{
  "input": { "strategy": "bogo", "basePrice": 10, "quantity": 5 },
  "result": {
    "finalPrice": 30,
    "discount": 20,
    "strategy": "Buy one get one free (2 free items)"
  }
}
```

**Tiered pricing:**

```bash
curl -X POST http://localhost:3000/strategy/pricing \
  -H "Content-Type: application/json" \
  -d '{
    "strategy": "tiered",
    "basePrice": 5.99,
    "quantity": 25
  }'
```

**Expected response:**

```json
{
  "input": { "strategy": "tiered", "basePrice": 5.99, "quantity": 25 },
  "result": {
    "finalPrice": 134.78,
    "discount": 14.98,
    "strategy": "Tiered pricing: 11-50 items (10% off)"
  }
}
```

## Key Files

| File | Description |
|------|-------------|
| `pricing-strategy.interface.ts` | Defines the `PricingStrategy` interface and `PricingResult` type |
| `percentage-discount.strategy.ts` | Strategy applying a configurable percentage discount |
| `flat-discount.strategy.ts` | Strategy subtracting a fixed dollar amount (capped at subtotal) |
| `bogo.strategy.ts` | Buy-one-get-one-free strategy |
| `tiered-pricing.strategy.ts` | Volume-based tiered discount strategy (0%, 10%, or 20%) |
| `pricing.service.ts` | Injectable context service with `setStrategy()` and `calculatePrice()` |
| `strategy.controller.ts` | Maps request body to strategy selection and returns pricing results |
| `strategy.module.ts` | NestJS module registering the controller and pricing service |

## Related Patterns

- **State** -- Both use delegation to interchangeable objects, but State transitions happen implicitly based on internal conditions, while Strategy is chosen explicitly by the client.
- **Template Method** -- Template Method uses inheritance to vary parts of an algorithm; Strategy uses composition to swap entire algorithms.
- **Factory Method** -- Can be used to create strategy instances, decoupling the client from concrete strategy classes.
