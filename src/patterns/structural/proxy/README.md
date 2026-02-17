# Proxy Pattern

## Intent

Provide a surrogate or placeholder for another object to control access to it.

## Problem

An e-commerce platform has a product catalog service that simulates an expensive database lookup (500ms per call). Every request for product data hits this slow service, resulting in poor performance for frequently accessed products. Additionally, the catalog should be restricted based on user roles -- not every caller should be allowed to query the catalog. Without an intermediary, caching logic and access control checks would need to be embedded directly in the catalog service or scattered across controllers.

## Solution

The Proxy pattern introduces two proxy objects that wrap the real `ProductCatalogService`: a **Caching Proxy** that stores previously fetched results in memory and returns them instantly on subsequent requests, and an **Access Control Proxy** that checks the caller's role before allowing access. Both proxies implement the same `ProductCatalog` interface as the real service, so the client interacts with them transparently. The proxies are layered: the access control proxy wraps the caching proxy, which wraps the real service.

## Structure

- **Subject Interface** (`ProductCatalog`): Declares `getProduct(id)` and `listProducts()` methods that both the real service and proxies implement.
- **Real Subject** (`ProductCatalogService`): The actual catalog service with hardcoded product data and a simulated 500ms delay on `getProduct()`.
- **Caching Proxy** (`CachingProxyService`): Wraps the real service. Caches `getProduct()` results in a `Map` and `listProducts()` results in a local variable. Returns cached data instantly on subsequent calls.
- **Access Control Proxy** (`AccessControlProxyService`): Wraps any `ProductCatalog`. Checks that the caller's role is either `"admin"` or `"user"` before delegating. Throws `ForbiddenException` for unauthorized roles.
- **Client** (`ProxyController`): Uses both proxies. First checks access via the access control proxy, then fetches data through the caching proxy (or bypasses the cache based on a query parameter).

## E-Commerce Example

This implementation models a product catalog with five products (Wireless Headphones, Leather Wallet, Running Shoes, Coffee Maker, Backpack). The `ProductCatalogService` simulates a slow database with a 500ms busy-wait on each `getProduct()` call.

The `CachingProxyService` eliminates repeated delays by storing results in a `Map<string, Product | null>`. The first request for product ID "1" takes ~500ms; the second returns instantly. The response metadata includes `servedFromCache`, `responseTimeMs`, and `cacheSize` so the caller can observe the caching behavior.

The `AccessControlProxyService` acts as a gatekeeper. Only roles `"admin"` and `"user"` are permitted; any other role (e.g., `"guest"`) receives a 403 Forbidden error. In the module, the access control proxy is wired around the caching proxy using a `useFactory` provider, creating a layered proxy chain: Access Control -> Caching -> Real Service.

## When to Use

- You need to add caching (virtual proxy) to avoid expensive repeated operations.
- You need to control access to an object based on permissions or roles (protection proxy).
- You want to add logging, monitoring, or lazy initialization without modifying the real object.
- You want to manage the lifecycle of a resource (e.g., remote proxy for network calls, smart reference for reference counting).
- The real object is expensive to create and you want to defer its creation until it is actually needed (lazy proxy).

## When NOT to Use

- The real object is already fast and lightweight -- a caching proxy adds memory overhead for no performance gain.
- Access control is better handled by framework-level guards (e.g., NestJS Guards) that apply uniformly across endpoints rather than per-service.
- The proxy interface would diverge significantly from the real subject, breaking the transparent substitution that the pattern relies on.

## NestJS Integration

All three classes (`ProductCatalogService`, `CachingProxyService`, `AccessControlProxyService`) are registered as NestJS providers. The `CachingProxyService` receives the real `ProductCatalogService` via standard constructor injection. The `AccessControlProxyService` is configured with a `useFactory` provider that injects the `CachingProxyService` as the underlying catalog, creating the proxy chain through NestJS's dependency injection. This demonstrates how NestJS's DI container can compose proxies declaratively in the module definition. The module exports both proxy services for use by other modules.

## API Endpoints

### GET /proxy/products/:id

Fetch a single product by ID, with access control and optional caching.

**Request (first call, cache miss):**

```bash
curl "http://localhost:3000/proxy/products/1?role=user&cache=true"
```

**Response:**

```json
{
  "product": {
    "id": "1",
    "name": "Wireless Headphones",
    "price": 79.99,
    "category": "Electronics"
  },
  "meta": {
    "role": "user",
    "cacheEnabled": true,
    "servedFromCache": false,
    "responseTimeMs": 501,
    "cacheSize": 1
  }
}
```

**Request (second call, cache hit):**

```bash
curl "http://localhost:3000/proxy/products/1?role=user&cache=true"
```

**Response:**

```json
{
  "product": {
    "id": "1",
    "name": "Wireless Headphones",
    "price": 79.99,
    "category": "Electronics"
  },
  "meta": {
    "role": "user",
    "cacheEnabled": true,
    "servedFromCache": true,
    "responseTimeMs": 0,
    "cacheSize": 1
  }
}
```

**Request (bypass cache):**

```bash
curl "http://localhost:3000/proxy/products/1?role=admin&cache=false"
```

**Request (unauthorized role):**

```bash
curl "http://localhost:3000/proxy/products/1?role=guest"
```

```json
{
  "statusCode": 403,
  "message": "Role \"guest\" does not have access to the product catalog"
}
```

### GET /proxy/products

List all products, with access control and optional caching.

**Request:**

```bash
curl "http://localhost:3000/proxy/products?role=user"
```

**Response:**

```json
{
  "products": [
    { "id": "1", "name": "Wireless Headphones", "price": 79.99, "category": "Electronics" },
    { "id": "2", "name": "Leather Wallet", "price": 49.99, "category": "Accessories" },
    { "id": "3", "name": "Running Shoes", "price": 119.99, "category": "Footwear" },
    { "id": "4", "name": "Coffee Maker", "price": 89.99, "category": "Kitchen" },
    { "id": "5", "name": "Backpack", "price": 59.99, "category": "Accessories" }
  ],
  "meta": {
    "role": "user",
    "cacheEnabled": true,
    "totalProducts": 5
  }
}
```

## Key Files

| File | Description |
|------|-------------|
| `product-catalog.interface.ts` | Defines the `ProductCatalog` subject interface and `Product` type |
| `product-catalog.service.ts` | Real subject with hardcoded products and a simulated 500ms lookup delay |
| `caching-proxy.service.ts` | Caching proxy that stores results in a `Map` for instant subsequent access |
| `access-control-proxy.service.ts` | Protection proxy that restricts access based on user role |
| `proxy.controller.ts` | REST controller that layers both proxies and exposes product endpoints |
| `proxy.module.ts` | NestJS module with `useFactory` wiring to compose the proxy chain |

## Related Patterns

- **Decorator**: Both wrap an object and implement the same interface. The difference is intent: Proxy controls access to the object, while Decorator adds new behavior. A caching proxy could be seen as a decorator, but its primary goal is access optimization, not behavior extension.
- **Adapter**: Adapter provides a different interface to the wrapped object; Proxy provides the same interface. Proxy is about controlling access; Adapter is about interface compatibility.
- **Facade**: Facade simplifies a complex subsystem's interface; Proxy provides the same interface as the real object. Facade is about simplification; Proxy is about indirection and control.
