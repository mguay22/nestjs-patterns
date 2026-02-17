# Flyweight Pattern

## Intent

Use sharing to support large numbers of fine-grained objects efficiently by separating intrinsic (shared) state from extrinsic (unique) state.

## Problem

An e-commerce platform sells products in many variants -- a single t-shirt comes in 4 colors and 4 sizes (16 variants), sneakers come in 3 colors and 5 sizes (15 variants), and so on. Each variant stores product type information (name, description, base price, category) that is identical across all variants of the same type. Naively duplicating this data for every variant wastes memory, especially when dealing with thousands of products across millions of SKUs.

## Solution

The Flyweight pattern extracts the shared, intrinsic state (product type information) into a separate `ProductType` object that is created once and reused across all variants of that type. A `ProductTypeFactoryService` acts as a flyweight factory, caching `ProductType` instances by name and returning existing ones instead of creating duplicates. Each `ProductVariant` stores only its unique, extrinsic state (SKU, color, size) and holds a reference to its shared `ProductType`.

## Structure

- **Flyweight** (`ProductType`): Stores the intrinsic, shared state: `typeName`, `description`, `basePrice`, and `category`. Immutable and reusable across many contexts.
- **Context** (`ProductVariant`): Stores the extrinsic, unique state: `sku`, `color`, and `size`. Holds a reference to its shared `ProductType` flyweight.
- **Flyweight Factory** (`ProductTypeFactoryService`): Manages a cache (`Map<string, ProductType>`) of flyweight objects. The `getProductType()` method returns an existing instance if one exists for the given type name, or creates and caches a new one.
- **Client** (`FlyweightController`): Creates many `ProductVariant` instances, each referencing a shared `ProductType` obtained from the factory.

## E-Commerce Example

This implementation demonstrates memory savings through shared product type data:

- **T-Shirts**: 4 colors (Red, Blue, Black, White) x 4 sizes (S, M, L, XL) = 16 variants, all sharing one `ProductType` instance ("T-Shirt", "Premium cotton t-shirt", $29.99, "Clothing").
- **Sneakers**: 3 colors (White, Black, Grey) x 5 sizes (8, 9, 10, 11, 12) = 15 variants, all sharing one `ProductType` instance ("Sneaker", "Lightweight running sneaker", $89.99, "Footwear").
- **Laptops**: 2 colors (Silver, Space Grey) x 3 sizes (13", 15", 17") = 6 variants, all sharing one `ProductType` instance ("Laptop", "High-performance laptop", $1,299.99, "Electronics").

In total, 37 variants share only 3 `ProductType` objects. The response includes a `memorySaved` field estimating how much memory is conserved by not duplicating type data across every variant (approximately 6.6KB at ~200 bytes per type object).

## When to Use

- Your application creates a very large number of objects that share significant amounts of common state.
- The shared state (intrinsic) can be cleanly separated from the unique state (extrinsic) for each object.
- Memory consumption is a concern and object count is high enough that sharing provides measurable savings.
- The identity of shared objects is unimportant -- clients do not need to distinguish between two flyweights with the same intrinsic state.
- Groups of objects can be replaced by a few shared objects once the extrinsic state is extracted.

## When NOT to Use

- The number of objects is small enough that the memory overhead is negligible and the added complexity is not justified.
- Objects have little or no shared state, making extraction meaningless.
- The "shared" state is actually mutable and changes independently for each context, which would break the flyweight's immutability contract and corrupt shared data.

## NestJS Integration

The `ProductTypeFactoryService` is registered as an `@Injectable()` NestJS provider, making it a singleton by default within the module scope. This is a natural fit for the flyweight factory, since singleton scope ensures that the cache persists across requests and the same `ProductType` instances are reused throughout the application's lifetime. The `ProductType` and `ProductVariant` classes are plain domain objects, not NestJS providers, because they represent data rather than services. The module exports the factory service so other modules can share product types from the same cache.

## API Endpoints

### GET /flyweight/products

Generate all product variants, demonstrating shared flyweight objects.

**Request:**

```bash
curl http://localhost:3000/flyweight/products
```

**Response (abbreviated):**

```json
{
  "variants": [
    {
      "sku": "TSH-RED-S",
      "color": "Red",
      "size": "S",
      "typeName": "T-Shirt",
      "description": "Premium cotton t-shirt",
      "basePrice": 29.99,
      "category": "Clothing"
    },
    {
      "sku": "TSH-RED-M",
      "color": "Red",
      "size": "M",
      "typeName": "T-Shirt",
      "description": "Premium cotton t-shirt",
      "basePrice": 29.99,
      "category": "Clothing"
    },
    {
      "sku": "SNK-WHITE-8",
      "color": "White",
      "size": "8",
      "typeName": "Sneaker",
      "description": "Lightweight running sneaker",
      "basePrice": 89.99,
      "category": "Footwear"
    }
  ],
  "uniqueTypes": 3,
  "totalVariants": 37,
  "memorySaved": "~6.6KB saved by sharing 3 type objects across 37 variants"
}
```

## Key Files

| File | Description |
|------|-------------|
| `product-type.ts` | Flyweight class storing shared intrinsic state (type name, description, price, category) |
| `product-variant.ts` | Context class storing extrinsic state (SKU, color, size) and referencing a shared `ProductType` |
| `product-type-factory.service.ts` | Flyweight factory that caches and reuses `ProductType` instances by name |
| `flyweight.controller.ts` | REST controller that creates variants and reports memory savings |
| `flyweight.module.ts` | NestJS module registering the controller and factory service |

## Related Patterns

- **Composite**: Flyweight is often combined with Composite. When a Composite tree has many similar leaf nodes, Flyweight can share their intrinsic state to reduce memory consumption.
- **Singleton**: The flyweight factory is often implemented as a Singleton to ensure a single cache. In NestJS, the default singleton provider scope achieves this naturally.
- **Factory Method**: The flyweight factory uses a creation method that returns existing instances when possible, similar in concept to Factory Method but focused on object reuse rather than creation flexibility.
