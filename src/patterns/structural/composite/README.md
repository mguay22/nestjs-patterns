# Composite Pattern

## Intent

Compose objects into tree structures to represent part-whole hierarchies, letting clients treat individual objects and compositions of objects uniformly.

## Problem

An e-commerce platform has a product catalog organized into categories. Categories can contain individual products or nested subcategories (e.g., "Electronics" contains "Phones" and "Laptops", each containing specific products). Without the Composite pattern, client code must distinguish between products and categories, using different logic to calculate totals, count items, or display the structure. This leads to complex conditional logic that breaks every time the hierarchy changes.

## Solution

The Composite pattern defines a common `CatalogComponent` interface that both individual products (leaves) and categories (composites) implement. Both respond to the same operations -- `getPrice()`, `getCount()`, `display()` -- but composites delegate to their children recursively. The client interacts with the entire tree through a single interface without caring whether it is dealing with a leaf or a branch.

## Structure

- **Component Interface** (`CatalogComponent`): Declares `getName()`, `getPrice()`, `getCount()`, and `display()` methods common to both leaves and composites.
- **Leaf** (`ProductItem`): Represents an individual product. `getPrice()` returns its own price, `getCount()` returns 1, and `display()` renders a single line.
- **Composite** (`Category`): Holds a collection of `CatalogComponent` children. `getPrice()` sums all children's prices recursively. `getCount()` sums all children's counts. `display()` renders its name and indents its children's output.
- **Client** (`CatalogService`, `CompositeController`): Builds the tree and operates on the root node uniformly.

## E-Commerce Example

This implementation models a store catalog with a nested category hierarchy. The `CatalogService` builds a tree structured as follows:

- **Store Catalog** (root category)
  - **Electronics** (category)
    - **Phones** (subcategory): iPhone 16 Pro ($1,199.99), Samsung Galaxy S25 ($999.99), Google Pixel 9 ($799.99)
    - **Laptops** (subcategory): MacBook Pro 16" ($2,499.99), Dell XPS 15 ($1,799.99), ThinkPad X1 Carbon ($1,599.99)
  - **Clothing** (category)
    - **Men** (subcategory): Cotton T-Shirt ($29.99), Slim Fit Jeans ($59.99)
    - **Women** (subcategory): Summer Dress ($79.99), Leather Jacket ($199.99)

Calling `getPrice()` on the root returns the sum of all 10 products. Calling `getCount()` returns 10. Calling `display()` returns a formatted, indented text representation of the entire tree. The `ProductItem` class maps to the Leaf role, and the `Category` class maps to the Composite role.

## When to Use

- You need to represent a tree structure (part-whole hierarchy) where clients should treat individual items and groups uniformly.
- You want operations like totaling prices, counting elements, or rendering structure to work recursively across the entire tree.
- You are building hierarchical data structures such as catalogs, menus, file systems, or organizational charts.
- You want to add new kinds of components (leaves or composites) without modifying existing client code.

## When NOT to Use

- Your data is flat (not hierarchical) -- Composite adds unnecessary complexity when a simple list would suffice.
- The operations on leaves and composites are fundamentally different, making a uniform interface misleading or forcing leaves to implement irrelevant methods (e.g., `add()` and `remove()` on a leaf).
- You need strict type safety to distinguish between leaves and composites at compile time, as Composite intentionally blurs that distinction.

## NestJS Integration

The `CatalogService` is registered as an `@Injectable()` NestJS provider responsible for constructing the composite tree. The `CompositeController` depends on `CatalogService` via constructor injection. The `ProductItem` and `Category` classes are plain TypeScript classes (not NestJS providers) because they represent domain objects instantiated dynamically rather than singleton services. The module exports `CatalogService` so that other modules can reuse the catalog-building logic.

## API Endpoints

### GET /composite/catalog

Retrieve the full catalog tree with total price, item count, and formatted structure.

**Request:**

```bash
curl http://localhost:3000/composite/catalog
```

**Response:**

```json
{
  "totalPrice": 9269.91,
  "totalItems": 10,
  "structure": "+ Store Catalog\n  + Electronics\n    + Phones\n      - iPhone 16 Pro ($1199.99)\n      - Samsung Galaxy S25 ($999.99)\n      - Google Pixel 9 ($799.99)\n    + Laptops\n      - MacBook Pro 16\" ($2499.99)\n      - Dell XPS 15 ($1799.99)\n      - ThinkPad X1 Carbon ($1599.99)\n  + Clothing\n    + Men\n      - Cotton T-Shirt ($29.99)\n      - Slim Fit Jeans ($59.99)\n    + Women\n      - Summer Dress ($79.99)\n      - Leather Jacket ($199.99)"
}
```

## Key Files

| File | Description |
|------|-------------|
| `catalog-component.interface.ts` | Defines the `CatalogComponent` interface shared by leaves and composites |
| `product-item.ts` | Leaf class representing an individual product with a name and price |
| `category.ts` | Composite class that holds children and delegates operations recursively |
| `catalog.service.ts` | Service that builds the complete catalog tree with sample data |
| `composite.controller.ts` | REST controller exposing the catalog endpoint |
| `composite.module.ts` | NestJS module registering the controller and service |

## Related Patterns

- **Decorator**: Both Composite and Decorator use recursive composition, but Decorator adds responsibilities to a single object while Composite aggregates multiple objects into a tree. They are often used together.
- **Iterator**: Can be used to traverse the Composite tree structure without exposing its internal representation.
- **Flyweight**: When a Composite tree contains many similar leaf nodes, Flyweight can be used to share their intrinsic state and reduce memory usage.
