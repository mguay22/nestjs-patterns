# Abstract Factory

## Intent

Provide an interface for creating families of related or dependent objects without specifying their concrete classes.

## Problem

An e-commerce platform typically integrates with multiple payment providers (Stripe, PayPal, etc.). Each provider requires its own payment processor and refund handler, and these objects must be compatible with each other -- you cannot process a payment through Stripe and then issue a refund through PayPal. If the client code creates these objects directly, it becomes riddled with conditionals, and adding a new payment provider forces changes throughout the codebase.

## Solution

The Abstract Factory pattern defines an interface (`PaymentFactory`) with methods for creating each member of a product family (`createPaymentProcessor()` and `createRefundHandler()`). Each concrete factory (`StripeFactory`, `PaypalFactory`) implements this interface and produces objects that are guaranteed to work together. The client code programs against the abstract factory interface and never references concrete classes, making it straightforward to add new providers by implementing a new factory without modifying existing code.

## Structure

- **AbstractFactory (PaymentFactory):** Declares the interface for creating each product in the family: `createPaymentProcessor()` and `createRefundHandler()`.
- **ConcreteFactory (StripeFactory, PaypalFactory):** Implements the abstract factory interface. Each factory creates products that belong to the same provider family.
- **AbstractProduct (PaymentProcessor, RefundHandler):** Interfaces that define the contract for each type of product in the family.
- **ConcreteProduct (StripePaymentProcessor, StripeRefundHandler, PaypalPaymentProcessor, PaypalRefundHandler):** The actual implementations, each specific to a provider.
- **Client (AbstractFactoryController):** Uses only the abstract factory and abstract product interfaces. It selects a factory based on the request and delegates object creation to it.

## E-Commerce Example

This implementation models a **payment processing subsystem** for an e-commerce checkout. The platform supports two payment providers:

1. **Stripe** -- Charges a processing fee of 2.9% + $0.30, generates transaction IDs prefixed with `stripe_txn_`, and estimates refunds in 5-10 business days.
2. **PayPal** -- Charges a processing fee of 3.49% + $0.49, generates transaction IDs prefixed with `paypal_txn_`, and estimates refunds in 3-5 business days.

Each provider is encapsulated in its own directory with a factory, a payment processor, and a refund handler. The controller selects the correct factory based on the `provider` field in the request body, creates a payment processor from that factory, and processes the payment.

| Pattern Role | Implementation |
|---|---|
| AbstractFactory | `PaymentFactory` interface |
| ConcreteFactory | `StripeFactory`, `PaypalFactory` |
| AbstractProduct | `PaymentProcessor`, `RefundHandler` interfaces |
| ConcreteProduct (Stripe) | `StripePaymentProcessor`, `StripeRefundHandler` |
| ConcreteProduct (PayPal) | `PaypalPaymentProcessor`, `PaypalRefundHandler` |
| Client | `AbstractFactoryController` |

## When to Use

- Your system must work with multiple families of related products (e.g., payment processors and refund handlers from the same provider).
- You need to ensure that products from different families are not accidentally mixed (e.g., processing with Stripe but refunding through PayPal).
- You want to add new product families (new payment providers) without modifying existing client code.
- You want to encapsulate platform or vendor differences behind a common interface.
- The product creation logic is complex enough that centralizing it in a factory improves maintainability.

## When NOT to Use

- When there is only one family of products and no realistic chance of adding more. The extra layer of abstraction adds complexity without benefit.
- When the products in a family are unrelated and do not need to be kept consistent with each other. In that case, separate Factory Methods are simpler.
- When the number of product types in a family changes frequently. Each change to the abstract factory interface forces changes in every concrete factory.

## NestJS Integration

In NestJS, each concrete factory is decorated with `@Injectable()` and registered as a provider in the module. The controller injects both `StripeFactory` and `PaypalFactory` and selects the correct one at runtime based on the incoming request.

This pattern maps well to NestJS idioms in several ways:

- **Custom providers with `useFactory`:** You could use NestJS's `useFactory` to dynamically select and return the correct factory based on environment configuration.
- **Module-level encapsulation:** Each provider family (Stripe, PayPal) is organized in its own subdirectory, mirroring the NestJS convention of grouping related concerns.
- **Dependency injection:** The concrete product classes (`StripePaymentProcessor`, etc.) are created by the factory, not by the IoC container. This is intentional -- the factory controls the instantiation, and the container manages the factories themselves.

To add a new provider (e.g., Square), you would create a new directory with `SquareFactory`, `SquarePaymentProcessor`, and `SquareRefundHandler`, register the factory in the module, and add it to the controller's factory map. No existing code needs to change.

## API Endpoints

### POST /abstract-factory/checkout

Processes a payment using the specified provider.

**Stripe checkout:**

```bash
curl -X POST http://localhost:3000/abstract-factory/checkout \
  -H "Content-Type: application/json" \
  -d '{"provider": "stripe", "amount": 99.99}'
```

Expected response:

```json
{
  "payment": {
    "success": true,
    "transactionId": "stripe_txn_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "provider": "stripe",
    "amount": 99.99,
    "currency": "USD",
    "processingFee": 3.2
  },
  "refundHandler": "available",
  "provider": "stripe"
}
```

**PayPal checkout:**

```bash
curl -X POST http://localhost:3000/abstract-factory/checkout \
  -H "Content-Type: application/json" \
  -d '{"provider": "paypal", "amount": 99.99}'
```

Expected response:

```json
{
  "payment": {
    "success": true,
    "transactionId": "paypal_txn_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "provider": "paypal",
    "amount": 99.99,
    "currency": "USD",
    "processingFee": 3.98
  },
  "refundHandler": "available",
  "provider": "paypal"
}
```

## Key Files

| File | Description |
|---|---|
| `payment.interfaces.ts` | Defines the `PaymentProcessor` and `RefundHandler` abstract product interfaces. |
| `payment-factory.interface.ts` | Defines the `PaymentFactory` abstract factory interface with `createPaymentProcessor()` and `createRefundHandler()`. |
| `stripe/stripe.factory.ts` | Concrete factory that creates Stripe-specific payment processors and refund handlers. |
| `stripe/stripe-payment-processor.ts` | Stripe payment processor implementation with 2.9% + $0.30 fee calculation. |
| `stripe/stripe-refund-handler.ts` | Stripe refund handler implementation with 5-10 business day estimates. |
| `paypal/paypal.factory.ts` | Concrete factory that creates PayPal-specific payment processors and refund handlers. |
| `paypal/paypal-payment-processor.ts` | PayPal payment processor implementation with 3.49% + $0.49 fee calculation. |
| `paypal/paypal-refund-handler.ts` | PayPal refund handler implementation with 3-5 business day estimates. |
| `abstract-factory.controller.ts` | Controller that selects the correct factory based on the provider field and processes payments. |
| `abstract-factory.module.ts` | NestJS module that registers both concrete factories as providers. |

## Related Patterns

- **Factory Method:** Abstract Factory is often implemented using Factory Methods. The key difference is that Abstract Factory creates entire families of related objects, while Factory Method creates a single product.
- **Singleton:** Concrete factories are often implemented as Singletons since typically only one instance of each factory is needed. In this NestJS implementation, the default singleton scope handles this automatically.
- **Builder:** While Abstract Factory focuses on what gets created (families of products), Builder focuses on how a complex object is constructed step by step. They can be combined when a factory needs to build complex products.
