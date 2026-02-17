# Factory Method

## Intent

Define an interface for creating an object, but let subclasses decide which class to instantiate.

## Problem

When an application needs to create objects that share a common interface but differ in their concrete implementation, hard-coding the creation logic with `new ConcreteClass()` scattered throughout the codebase leads to tight coupling. If you later need to add a new product type, you must hunt down every instantiation site and modify it. In an e-commerce system, a product listing for a physical book, a digital download, and a monthly subscription all share common traits (name, price) but each has unique details (shipping weight vs. download URL vs. billing cycle).

## Solution

The Factory Method pattern defines an abstract `createProduct()` method in a base creator class. Each subclass overrides this method to produce a specific type of product. The base creator can also contain shared logic (such as adding a timestamp and SKU) that runs regardless of which concrete product is created. Client code works with the abstract creator interface and never needs to know which concrete class is instantiated.

## Structure

- **Product (Product interface):** Defines the common interface that all products must implement. Contains `name`, `price`, `type`, and `details`.
- **Creator (ProductCreator):** An abstract class that declares the factory method `createProduct()` and provides a template method `getProduct()` that calls the factory method and enriches the result with a `createdAt` timestamp and a generated `sku`.
- **ConcreteCreator (PhysicalProductCreator, DigitalProductCreator, SubscriptionProductCreator):** Each subclass implements `createProduct()` to return a specific product type with its own details.
- **Client (FactoryMethodController):** Receives a product type string, selects the appropriate creator, and delegates product creation without knowing the concrete class.

## E-Commerce Example

This implementation models a **product catalog system** where an e-commerce platform sells three types of products:

1. **Physical products** -- items that require shipping, have weight and dimensions, and are assigned to a warehouse.
2. **Digital products** -- downloadable files with a URL, file size, format, and license type.
3. **Subscription products** -- recurring billing items with a billing cycle, duration, auto-renewal, and trial period.

All three share the same `Product` interface. The `ProductCreator` base class handles cross-cutting concerns (SKU generation, creation timestamp) in its `getProduct()` template method, while each concrete creator fills in the type-specific details.

| Pattern Role | Implementation |
|---|---|
| Product | `Product` interface |
| Creator | `ProductCreator` abstract class |
| ConcreteCreator | `PhysicalProductCreator`, `DigitalProductCreator`, `SubscriptionProductCreator` |
| Client | `FactoryMethodController` |

## When to Use

- You do not know in advance the exact types of objects your code will need to create.
- You want to provide a library or framework where users can extend the creation logic by subclassing.
- You want to centralize and reuse common creation logic (like SKU generation) while allowing the product-specific details to vary.
- You want to decouple the client from the concrete classes it instantiates, making it easy to add new product types without modifying existing code.
- You want to comply with the Open/Closed Principle: open for extension (new creators), closed for modification (existing client code).

## When NOT to Use

- When there is only one type of product and no foreseeable need for variation. Introducing the pattern adds unnecessary abstraction.
- When the creation logic is trivial (e.g., `new SomeClass(arg)`) and all products are essentially identical. A simple constructor call is clearer.
- When the type hierarchy is unstable and changes affect the creator interface itself. In that case, the pattern can amplify churn rather than reduce it.

## NestJS Integration

In NestJS, the Factory Method pattern maps naturally to the provider system:

- Each concrete creator (`PhysicalProductCreator`, `DigitalProductCreator`, `SubscriptionProductCreator`) is decorated with `@Injectable()` and registered as a provider in the module.
- The controller injects all creators and selects the correct one based on the incoming request's `type` field.
- NestJS's built-in `useFactory` provider syntax is a related but distinct concept: it lets you define a factory function at the module level to create providers with custom logic. The Factory Method pattern goes a step further by using an inheritance hierarchy of creators.

You could also leverage NestJS custom providers with `useClass` to swap concrete creators via configuration, making the pattern even more flexible in a modular architecture.

## API Endpoints

### POST /factory-method/products

Creates a product using the appropriate factory based on the `type` field.

**Physical product:**

```bash
curl -X POST http://localhost:3000/factory-method/products \
  -H "Content-Type: application/json" \
  -d '{"type": "physical", "name": "Wireless Mouse", "price": 29.99}'
```

Expected response:

```json
{
  "name": "Wireless Mouse",
  "price": 29.99,
  "type": "physical",
  "details": {
    "weight": "0.5kg",
    "dimensions": "30x20x10cm",
    "shippingRequired": true,
    "warehouse": "WH-001"
  },
  "createdAt": "2026-02-16T12:00:00.000Z",
  "sku": "PHYSICAL-1708099200000"
}
```

**Digital product:**

```bash
curl -X POST http://localhost:3000/factory-method/products \
  -H "Content-Type: application/json" \
  -d '{"type": "digital", "name": "Photo Editor Pro", "price": 49.99}'
```

Expected response:

```json
{
  "name": "Photo Editor Pro",
  "price": 49.99,
  "type": "digital",
  "details": {
    "downloadUrl": "https://downloads.example.com/photo-editor-pro",
    "fileSize": "250MB",
    "format": "ZIP",
    "licenseType": "single-user"
  },
  "createdAt": "2026-02-16T12:00:00.000Z",
  "sku": "DIGITAL-1708099200000"
}
```

**Subscription product:**

```bash
curl -X POST http://localhost:3000/factory-method/products \
  -H "Content-Type: application/json" \
  -d '{"type": "subscription", "name": "Premium Membership", "price": 9.99}'
```

Expected response:

```json
{
  "name": "Premium Membership",
  "price": 9.99,
  "type": "subscription",
  "details": {
    "billingCycle": "monthly",
    "duration": "12 months",
    "autoRenew": true,
    "trialPeriodDays": 14
  },
  "createdAt": "2026-02-16T12:00:00.000Z",
  "sku": "SUBSCRIPTION-1708099200000"
}
```

## Key Files

| File | Description |
|---|---|
| `product.interface.ts` | Defines the `Product` interface shared by all product types. |
| `product-creator.ts` | Abstract `ProductCreator` base class with the factory method `createProduct()` and the template method `getProduct()`. |
| `physical-product.creator.ts` | Concrete creator that produces physical products with shipping details. |
| `digital-product.creator.ts` | Concrete creator that produces digital products with download details. |
| `subscription-product.creator.ts` | Concrete creator that produces subscription products with billing details. |
| `factory-method.controller.ts` | Controller that routes creation requests to the appropriate creator based on product type. |
| `factory-method.module.ts` | NestJS module that registers all creators as providers. |

## Related Patterns

- **Abstract Factory:** Often implemented using Factory Methods. While Factory Method creates a single product, Abstract Factory creates families of related products.
- **Template Method:** `ProductCreator.getProduct()` is itself a Template Method -- it defines a skeleton algorithm where the `createProduct()` step is deferred to subclasses.
- **Prototype:** An alternative to Factory Method that creates objects by cloning a prototype instead of calling a constructor through a creator hierarchy.
