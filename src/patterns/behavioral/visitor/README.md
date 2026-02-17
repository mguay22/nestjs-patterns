# Visitor

## Intent

Represent an operation to be performed on the elements of an object structure, letting you define a new operation without changing the classes of the elements on which it operates.

## Problem

An e-commerce order can contain different types of items -- physical goods, digital products, and subscriptions. Each item type has different rules for tax calculation, shipping cost, and discount eligibility. Adding a new cross-cutting operation (e.g., insurance calculation) would require modifying every item class, violating the open/closed principle.

## Solution

The Visitor pattern separates operations from the item class hierarchy. Each item type implements an `accept(visitor)` method that calls the appropriate visitor method for its type (double dispatch). New operations are added by creating new visitor classes, without modifying any existing item classes. Each visitor encapsulates the logic for one operation across all item types.

## Structure

- **Visitor (interface)** -- `OrderVisitor`: Declares `visitPhysicalItem()`, `visitDigitalItem()`, and `visitSubscriptionItem()`.
- **Concrete Visitors** -- `TaxCalculatorVisitor`, `ShippingCostVisitor`, `DiscountVisitor`: Each implements one cross-cutting operation with type-specific logic.
- **Element (interface)** -- `OrderItemElement`: Declares `accept(visitor)` along with common properties (`name`, `price`, `quantity`).
- **Concrete Elements** -- `PhysicalItem`, `DigitalItem`, `SubscriptionItem`: Each implements `accept()` by calling the visitor method for its own type.

## E-Commerce Example

This implementation models **order analysis** where three different visitors compute different aspects of an order containing mixed item types:

1. **TaxCalculatorVisitor**
   - Physical items: 10% tax
   - Digital items: 5% tax (lower digital tax rate)
   - Subscriptions: 8% tax

2. **ShippingCostVisitor**
   - Physical items: $5.99 per item
   - Digital items: $0 (no shipping)
   - Subscriptions: $0 (no shipping)

3. **DiscountVisitor**
   - Physical items: no discount
   - Digital items: 15% off
   - Subscriptions: 20% off (annual discount)

The controller accepts an array of items with their types, creates the corresponding element objects, runs all three visitors against each item, and returns a detailed breakdown (subtotal, tax, shipping, discount, total per item) along with aggregated totals.

## When to Use

- You need to perform many distinct operations on an object structure and want to avoid polluting the element classes with these operations.
- The element class hierarchy is stable (new types are rarely added), but new operations are added frequently.
- Operations need type-specific behavior but should not be embedded in the element classes.
- You want to accumulate results across an object structure without modifying the structure itself.
- You need to apply the same set of operations consistently across all element types.

## When NOT to Use

- New element types are added frequently -- each new type requires updating every visitor, which can be costly.
- The element hierarchy is simple with one or two types -- polymorphic methods on the elements themselves are simpler.
- The operations are tightly coupled to the element's internal state in ways that would break encapsulation.

## NestJS Integration

The controller acts as the client, creating element objects from the request body and running visitors against them. Visitor and element classes are plain TypeScript classes with no NestJS dependencies, making them easy to unit test. The `VisitorModule` registers only the controller since no injectable services are needed. The controller handles the orchestration of creating elements, applying all visitors, and aggregating results into the response.

## API Endpoints

### POST /visitor/orders/analyze

Analyzes an order by applying tax, shipping, and discount visitors to each item.

```bash
curl -X POST http://localhost:3000/visitor/orders/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "type": "physical", "name": "Laptop", "price": 999.99, "quantity": 1, "weight": 5 },
      { "type": "digital", "name": "E-Book", "price": 14.99, "quantity": 2 },
      { "type": "subscription", "name": "Cloud Storage", "price": 9.99, "quantity": 1 }
    ]
  }'
```

**Expected response:**

```json
{
  "items": [
    {
      "name": "Laptop",
      "type": "physical",
      "price": 999.99,
      "quantity": 1,
      "subtotal": 999.99,
      "tax": 100,
      "shipping": 5.99,
      "discount": 0,
      "total": 1105.98
    },
    {
      "name": "E-Book",
      "type": "digital",
      "price": 14.99,
      "quantity": 2,
      "subtotal": 29.98,
      "tax": 1.5,
      "shipping": 0,
      "discount": 4.5,
      "total": 26.98
    },
    {
      "name": "Cloud Storage",
      "type": "subscription",
      "price": 9.99,
      "quantity": 1,
      "subtotal": 9.99,
      "tax": 0.8,
      "shipping": 0,
      "discount": 2,
      "total": 8.79
    }
  ],
  "totals": {
    "subtotal": 1039.96,
    "tax": 102.3,
    "shipping": 5.99,
    "discount": 6.5,
    "grandTotal": 1141.75
  }
}
```

## Key Files

| File | Description |
|------|-------------|
| `order-visitor.interface.ts` | Defines the `OrderVisitor` interface with visit methods for each item type |
| `order-item-element.interface.ts` | Defines the `OrderItemElement` interface with `accept(visitor)` |
| `physical-item.ts` | Physical item element with optional `weight` property |
| `digital-item.ts` | Digital item element (no shipping) |
| `subscription-item.ts` | Subscription item element (recurring charge) |
| `tax-calculator.visitor.ts` | Visitor computing tax at type-specific rates (10%, 5%, 8%) |
| `shipping-cost.visitor.ts` | Visitor computing shipping ($5.99 for physical, $0 for others) |
| `discount.visitor.ts` | Visitor computing discounts (0% physical, 15% digital, 20% subscription) |
| `visitor.controller.ts` | Orchestrates element creation, visitor application, and result aggregation |
| `visitor.module.ts` | NestJS module registering the controller |

## Related Patterns

- **Composite** -- Visitor is often used with Composite to perform operations on a composite tree structure.
- **Iterator** -- Iterator traverses elements; Visitor performs operations on them. They are often used together.
- **Strategy** -- Both encapsulate algorithms, but Visitor provides multiple algorithms across a type hierarchy (double dispatch) while Strategy provides one algorithm at a time.
