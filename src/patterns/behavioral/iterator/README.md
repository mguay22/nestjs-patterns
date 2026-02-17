# Iterator

## Intent

Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.

## Problem

A product catalog in an e-commerce application can be browsed in many ways -- sorted by price, filtered by category, or paginated for display. If each traversal strategy is embedded directly into the collection class, the class becomes bloated with unrelated sorting, filtering, and pagination logic. Client code must also know the internal data structure to iterate correctly.

## Solution

The Iterator pattern extracts each traversal strategy into its own iterator object. The product collection provides factory methods to create the appropriate iterator, and each iterator encapsulates its own traversal logic (sorting, filtering, or paginating). Client code interacts with a uniform `hasNext()` / `next()` interface regardless of the underlying traversal strategy.

## Structure

- **Iterator (interface)** -- `Iterator<T>`: Declares `hasNext()`, `next()`, and `reset()`.
- **Concrete Iterators** -- `PriceAscendingIterator`, `CategoryIterator`, `PaginatedIterator`: Each implements a different traversal over the same product data.
- **Aggregate / Collection** -- `ProductCollection`: Stores products and provides factory methods (`createPriceAscendingIterator`, `createCategoryIterator`, `createPaginatedIterator`) to create iterators.
- **IterableCollection (interface)** -- Declares `createIterator()` as the default factory method.

## E-Commerce Example

This implementation models a **product catalog** containing 12 products across three categories (electronics, sports, books). The collection supports three traversal strategies:

1. **PriceAscendingIterator** -- Returns all products sorted by price from lowest to highest.
2. **CategoryIterator** -- Filters and returns only products matching a given category (case-insensitive).
3. **PaginatedIterator** -- Divides the product list into pages of a configurable size and iterates page by page.

The `IteratorController` selects the appropriate iterator based on query parameters: `sort=price` uses the price iterator, `category=electronics` uses the category iterator, and `page=1&pageSize=5` uses the paginated iterator. The default behavior (no query parameters) uses the price ascending iterator.

## When to Use

- You need to provide multiple traversal strategies over the same collection.
- You want to hide the internal structure of a collection from client code.
- You need a uniform interface for iterating over different data structures.
- You want to support concurrent or independent iterations over the same collection.
- Traversal logic is complex enough to warrant its own class.

## When NOT to Use

- The collection is simple and only needs one iteration order -- a basic `for` loop or `Array.forEach` suffices.
- Modern language features (generators, `Symbol.iterator`, array methods) already provide the needed iteration capabilities.
- The collection is very small and the overhead of iterator objects is unjustified.

## NestJS Integration

The `ProductCollection` is instantiated directly in the controller's constructor, acting as an in-memory data source. The controller uses query parameters to decide which iterator factory method to call. Iterator classes are plain TypeScript classes with no framework dependencies. The `IteratorModule` registers only the controller since no injectable services are needed.

## API Endpoints

### GET /iterator/products

Returns products using different iterator strategies based on query parameters.

**Default (price ascending):**

```bash
curl http://localhost:3000/iterator/products
```

**Sorted by price (explicit):**

```bash
curl "http://localhost:3000/iterator/products?sort=price"
```

**Expected response:**

```json
{
  "items": [
    { "id": "4", "name": "Novel", "price": 14.99, "category": "books" },
    { "id": "10", "name": "Science Fiction Anthology", "price": 19.99, "category": "books" },
    { "id": "7", "name": "Cookbook", "price": 24.99, "category": "books" },
    "...more items sorted by price..."
  ],
  "iteratorType": "priceAscending",
  "totalItems": 12
}
```

**Filtered by category:**

```bash
curl "http://localhost:3000/iterator/products?category=electronics"
```

**Expected response:**

```json
{
  "items": [
    { "id": "1", "name": "Laptop", "price": 999.99, "category": "electronics" },
    { "id": "2", "name": "Headphones", "price": 49.99, "category": "electronics" },
    { "id": "5", "name": "Smartphone", "price": 699.99, "category": "electronics" },
    { "id": "8", "name": "Tablet", "price": 449.99, "category": "electronics" },
    { "id": "11", "name": "Monitor", "price": 349.99, "category": "electronics" }
  ],
  "iteratorType": "category",
  "totalItems": 5,
  "category": "electronics"
}
```

**Paginated:**

```bash
curl "http://localhost:3000/iterator/products?page=2&pageSize=3"
```

**Expected response:**

```json
{
  "items": [
    { "id": "4", "name": "Novel", "price": 14.99, "category": "books" },
    { "id": "5", "name": "Smartphone", "price": 699.99, "category": "electronics" },
    { "id": "6", "name": "Yoga Mat", "price": 29.99, "category": "sports" }
  ],
  "iteratorType": "paginated",
  "totalItems": 12,
  "page": 2,
  "pageSize": 3,
  "totalPages": 4
}
```

## Key Files

| File | Description |
|------|-------------|
| `iterator.interface.ts` | Defines `Iterator<T>`, `IterableCollection<T>`, and `Product` interfaces |
| `price-ascending.iterator.ts` | Iterator that sorts products by price in ascending order |
| `category.iterator.ts` | Iterator that filters products by a given category |
| `paginated.iterator.ts` | Iterator that groups products into pages of a configurable size |
| `product-collection.ts` | Collection class with factory methods for each iterator type |
| `iterator.controller.ts` | Selects and uses the appropriate iterator based on query parameters |
| `iterator.module.ts` | NestJS module registering the controller |

## Related Patterns

- **Composite** -- Iterators are often used to traverse composite (tree) structures.
- **Factory Method** -- The collection uses factory methods (`createPriceAscendingIterator`, etc.) to create the appropriate iterator type.
- **Visitor** -- Both traverse a structure, but Visitor performs operations on elements while Iterator focuses on the traversal order and access.
