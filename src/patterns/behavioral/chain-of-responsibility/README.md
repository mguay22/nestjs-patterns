# Chain of Responsibility

## Intent

Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request, chaining the receiving objects and passing the request along the chain until an object handles it.

## Problem

When processing an incoming order, you need to run multiple validation checks -- inventory availability, payment method validity, fraud detection, and address verification. Hard-coding all of these checks into a single service creates a monolithic validator that is difficult to extend, reorder, or test in isolation. Adding a new validation step requires modifying existing code rather than simply plugging in a new handler.

## Solution

The Chain of Responsibility pattern organizes validators as a linked list of handler objects. Each handler performs its own check and then delegates to the next handler in the chain. The request flows through every handler, collecting validation results along the way. New handlers can be inserted or removed without touching existing ones.

## Structure

- **Handler (abstract)** -- `OrderValidator`: Declares the `validate()` and abstract `check()` methods, and holds a reference to the next handler via `setNext()`.
- **Concrete Handlers** -- `InventoryCheckHandler`, `PaymentValidationHandler`, `FraudDetectionHandler`, `AddressValidationHandler`: Each implements `check()` with its own validation logic.
- **Client / Invoker** -- `ValidationChainService`: Assembles the chain in a specific order and exposes a single `validate()` entry point.

## E-Commerce Example

This implementation models an **order validation pipeline** for an e-commerce checkout flow. When a customer submits an order, it passes through four sequential validators:

1. **InventoryCheckHandler** -- verifies items are in stock, quantities are valid (1-100), and the order is not empty.
2. **PaymentValidationHandler** -- confirms the payment method is accepted (`credit_card`, `debit_card`, `paypal`, `bank_transfer`), the total is positive, and the calculated item total matches the declared total.
3. **FraudDetectionHandler** -- flags orders above $10,000, orders shipping to suspicious countries (`XX`, `YY`, `ZZ`), and orders with duplicate items.
4. **AddressValidationHandler** -- ensures the shipping address has a street, city, valid ZIP code, and country code.

The chain is assembled in `ValidationChainService` as: Inventory -> Payment -> Fraud -> Address. All handlers run regardless of earlier failures, so the response contains a complete list of all validation errors.

## When to Use

- You have multiple processors that should each get a chance to handle or validate a request.
- The set of handlers or their order needs to change at runtime or across configurations.
- You want to decouple the sender of a request from the concrete handlers.
- Each handler should be independently testable and reusable.
- You need to collect results from all handlers rather than stopping at the first one.

## When NOT to Use

- There is only one handler or validation step -- a simple function call suffices.
- The processing order is tightly coupled and must never change -- a direct procedural approach is clearer.
- You need guaranteed handling by exactly one handler -- consider the Strategy pattern instead.

## NestJS Integration

The `OrderValidator` abstract class serves as the handler base. Each concrete handler is a plain TypeScript class. The `ValidationChainService` is decorated with `@Injectable()` and assembles the chain in its constructor, making it available for dependency injection throughout the NestJS application. The chain is wired up in `ChainOfResponsibilityModule` as a provider and exported for use by other modules.

## API Endpoints

### POST /chain/orders/validate

Validates an order through the full chain of handlers.

```bash
curl -X POST http://localhost:3000/chain/orders/validate \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "name": "Laptop", "price": 999.99, "qty": 1 },
      { "name": "Headphones", "price": 49.99, "qty": 2 }
    ],
    "paymentMethod": "credit_card",
    "totalAmount": 1099.97,
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Springfield",
      "zip": "62704",
      "country": "US"
    }
  }'
```

**Expected response (valid order):**

```json
{
  "order": { "...order data..." },
  "validation": {
    "isValid": true,
    "results": [
      { "valid": true, "errors": [], "handlerName": "InventoryCheck" },
      { "valid": true, "errors": [], "handlerName": "PaymentValidation" },
      { "valid": true, "errors": [], "handlerName": "FraudDetection" },
      { "valid": true, "errors": [], "handlerName": "AddressValidation" }
    ],
    "errors": []
  }
}
```

**Example with validation errors:**

```bash
curl -X POST http://localhost:3000/chain/orders/validate \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "name": "Discontinued-Widget", "price": 50, "qty": 1 }
    ],
    "paymentMethod": "bitcoin",
    "totalAmount": 50,
    "shippingAddress": {
      "street": "",
      "city": "Springfield",
      "zip": "62704",
      "country": "US"
    }
  }'
```

## Key Files

| File | Description |
|------|-------------|
| `order-validator.interface.ts` | Abstract handler base class with `setNext()` and `validate()` chain logic |
| `inventory-check.handler.ts` | Validates item availability, quantity limits, and non-empty orders |
| `payment-validation.handler.ts` | Validates payment method, positive total, and total amount consistency |
| `fraud-detection.handler.ts` | Flags high-value orders, suspicious countries, and duplicate items |
| `address-validation.handler.ts` | Validates shipping address completeness and ZIP code format |
| `validation-chain.service.ts` | Injectable service that assembles the handler chain and exposes `validate()` |
| `chain-of-responsibility.controller.ts` | Exposes the `POST /chain/orders/validate` endpoint |
| `chain-of-responsibility.module.ts` | NestJS module registering the controller and service |

## Related Patterns

- **Decorator** -- Both compose objects in a chain, but Decorator adds responsibilities to a single object while Chain of Responsibility passes a request along until it is handled.
- **Command** -- Commands can be chained through a Chain of Responsibility where each handler decides whether to execute or forward the command.
- **Composite** -- The chain can be viewed as a degenerate tree (a linked list); Composite organizes handlers in a tree structure instead.
