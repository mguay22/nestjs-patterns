# Decorator Pattern

## Intent

Attach additional responsibilities to an object dynamically, providing a flexible alternative to subclassing for extending functionality.

## Problem

An e-commerce platform needs to process orders with varying combinations of cross-cutting concerns: sometimes orders need validation, sometimes logging, sometimes a discount is applied, and sometimes all three. Creating subclasses for every combination (e.g., `ValidatedLoggingDiscountOrderProcessor`) leads to an exponential number of classes. You need a way to compose these behaviors at runtime without modifying the core processing logic.

## Solution

The Decorator pattern wraps the base `OrderProcessor` in one or more decorator objects that each add a specific behavior (logging, validation, discount) while preserving the same `OrderProcessor` interface. Decorators delegate to the wrapped object and augment the result. They can be stacked in any order, and the client specifies which decorators to apply at runtime via the request payload.

## Structure

- **Component Interface** (`OrderProcessor`): Defines the `process(order)` method that all processors and decorators must implement.
- **Concrete Component** (`BaseOrderProcessor`): The core implementation that creates an order, calculates the total, and returns a `ProcessedOrder`.
- **Decorators** (`LoggingDecorator`, `ValidationDecorator`, `DiscountDecorator`): Each wraps an `OrderProcessor`, calls the wrapped object's `process()` method, and adds its own behavior (logging output, input validation, or price discount).
- **TypeScript Method Decorator** (`TrackExecution`): A separate, NestJS-style method decorator that measures execution time of the controller method -- demonstrating that the GoF Decorator pattern and language-level decorators serve complementary purposes.
- **Client** (`DecoratorController`): Builds the decorator chain dynamically based on the `decorators` array in the request body.

## E-Commerce Example

This implementation models an order processing pipeline. The `BaseOrderProcessor` takes a list of items, sums their prices, generates an order ID, and returns a `ProcessedOrder` with a `steps` array tracking what happened.

The `ValidationDecorator` checks that the order has at least one item and that all prices are positive before delegating to the wrapped processor. The `LoggingDecorator` logs order details to the console before and after processing. The `DiscountDecorator` applies a 10% discount to the total after the wrapped processor calculates it.

Each decorator appends a description of its action to the `steps` array, giving full visibility into the processing pipeline. The client can request any combination: `["validation", "logging", "discount"]`, `["validation"]`, or even an empty array for base processing only.

Additionally, the `TrackExecution` TypeScript method decorator is applied to the controller's `processOrder` method, measuring and logging execution time -- showing how language-level decorators complement the GoF pattern.

## When to Use

- You need to add responsibilities to objects dynamically and transparently, without affecting other objects.
- You want to combine multiple independent behaviors (cross-cutting concerns) in different configurations at runtime.
- Subclassing is impractical because the number of combinations would lead to a class explosion.
- You want each added behavior to be independently testable and reusable.
- You are building a processing pipeline where steps can be added, removed, or reordered.

## When NOT to Use

- The order in which decorators are applied does not matter and never will -- a simpler chain-of-responsibility or middleware approach may be clearer.
- You only need one fixed combination of behaviors that will never change, making the extra wrapping overhead unnecessary.
- Decorators rely heavily on the component interface remaining stable; if the interface changes frequently, maintaining many decorator classes becomes burdensome.

## NestJS Integration

The `DecoratorController` is the only NestJS-managed class in this pattern. The `BaseOrderProcessor` and its decorators are plain classes instantiated at request time, allowing fully dynamic composition based on the request payload. The `@TrackExecution()` TypeScript method decorator shows how NestJS's native decorator system (used for `@Controller`, `@Get`, `@Injectable`, etc.) parallels the GoF Decorator concept at the language level. In production, common decorators could be pre-configured as NestJS providers with known stacking orders.

## API Endpoints

### POST /decorator/orders/process

Process an order with a dynamically selected set of decorators.

**Request:**

```bash
curl -X POST http://localhost:3000/decorator/orders/process \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"name": "Keyboard", "price": 79.99},
      {"name": "Mouse", "price": 49.99}
    ],
    "decorators": ["validation", "logging", "discount"]
  }'
```

**Response:**

```json
{
  "orderId": "ORD-1700000000000",
  "steps": [
    "Base processing: order created",
    "Logging: order processing logged",
    "Discount: 10% discount applied (-$12.00)",
    "Validation: all items validated successfully"
  ],
  "total": 107.98,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Request (base processing only, no decorators):**

```bash
curl -X POST http://localhost:3000/decorator/orders/process \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"name": "Monitor", "price": 299.99}],
    "decorators": []
  }'
```

**Response:**

```json
{
  "orderId": "ORD-1700000000000",
  "steps": ["Base processing: order created"],
  "total": 299.99,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Key Files

| File | Description |
|------|-------------|
| `order-processor.interface.ts` | Defines `OrderProcessor`, `OrderData`, `OrderItem`, and `ProcessedOrder` types |
| `base-order-processor.ts` | Core order processor that calculates totals and creates order records |
| `logging.decorator.ts` | Decorator that logs order processing to the console |
| `validation.decorator.ts` | Decorator that validates items and prices before processing |
| `discount.decorator.ts` | Decorator that applies a percentage discount to the order total |
| `track-execution.decorator.ts` | TypeScript method decorator that measures and logs execution time |
| `decorator.controller.ts` | REST controller that builds the decorator chain from request input |
| `decorator.module.ts` | NestJS module registering the controller |

## Related Patterns

- **Composite**: Both use recursive composition, but Composite is about representing tree structures while Decorator is about adding behavior to a single object. Composite aggregates; Decorator augments.
- **Strategy**: Strategy replaces the entire algorithm, while Decorator wraps and enhances existing behavior. Decorator preserves the original behavior and layers on top of it.
- **Chain of Responsibility**: Both process requests through a sequence of handlers. Chain of Responsibility allows any handler to stop the chain, while Decorator always delegates to the wrapped object and augments the result.
