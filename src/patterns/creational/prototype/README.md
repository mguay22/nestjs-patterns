# Prototype

## Intent

Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.

## Problem

In an e-commerce catalog, many products are variations of a base template. A "Basic T-Shirt" comes in different colors and sizes, but the core attributes (material, care instructions, category, base price) remain the same. Creating each variation from scratch is tedious and error-prone -- you might forget a field or introduce inconsistencies. Furthermore, if the base template changes (e.g., a new care instruction), you need to update every variation individually.

## Solution

The Prototype pattern allows you to create new objects by cloning an existing prototype rather than constructing from scratch. A `ProductTemplate` class implements a `clone()` method that produces a deep copy of itself. A `TemplateRegistryService` holds a collection of pre-configured prototypes. When a new product variation is needed, the client retrieves the appropriate template from the registry, clones it, and customizes the clone with variation-specific overrides. The original prototype remains untouched.

## Structure

- **Prototype (Prototype\<T\> interface):** Declares the `clone()` method that all prototypable objects must implement.
- **ConcretePrototype (ProductTemplate):** Implements the `clone()` method, using `structuredClone()` for deep copying of nested `attributes` and constructor calls for the top-level object.
- **Registry (TemplateRegistryService):** Stores a map of named prototypes. Provides methods to retrieve, add, and list templates. Pre-loaded with three default templates on construction.
- **Client (PrototypeController):** Retrieves a template by ID, clones it, applies optional customizations from the request body, and returns the new product.

## E-Commerce Example

This implementation models a **product template system** for an e-commerce catalog. The registry comes pre-loaded with three product templates:

1. **basic-tshirt** -- A $19.99 cotton t-shirt in the "apparel" category, available in sizes S/M/L/XL and colors white/black/navy.
2. **premium-headphones** -- $299.99 wireless over-ear headphones in the "electronics" category, with noise cancelling and 30-hour battery life.
3. **ebook-template** -- A $9.99 digital book in the "digital" category, in PDF format, 200 pages, DRM-free and downloadable.

When creating a new product, the client specifies a template ID and optional customizations. For example, to create a red t-shirt at a sale price, you clone `basic-tshirt` and override the `name`, `price`, and `attributes.colors` fields. The original template is unaffected, and the clone has its own independent copy of all nested data.

| Pattern Role | Implementation |
|---|---|
| Prototype Interface | `Prototype<T>` |
| ConcretePrototype | `ProductTemplate` |
| Registry | `TemplateRegistryService` |
| Client | `PrototypeController` |

## When to Use

- You need to create many variations of an object that share most of their state, and only a few fields differ.
- Object creation is expensive or complex, and cloning is significantly cheaper.
- You want to avoid building a parallel hierarchy of factories to create variations -- one registry of prototypes replaces many factory classes.
- The set of prototypes can be defined at runtime and extended dynamically (e.g., admin users adding new product templates).
- You want to preserve the original template while allowing independent modifications to each clone.

## When NOT to Use

- When objects have circular references or complex internal dependencies that make deep copying unreliable or expensive.
- When each new object is fundamentally different from any existing prototype. If there is no meaningful "base" to clone from, the pattern provides no advantage over direct construction.
- When the object graph is trivially simple (one or two primitive fields). The overhead of implementing `clone()` and managing a registry outweighs the benefit.

## NestJS Integration

In NestJS, the `TemplateRegistryService` is decorated with `@Injectable()` and registered as a singleton provider. Because it is a singleton, the registry is initialized once with the default templates and shared across all requests. This makes it an in-memory prototype store that persists for the lifetime of the application.

Key NestJS integration points:

- **Singleton registry:** The default NestJS singleton scope is ideal for a prototype registry. All requests share the same template collection, and templates added at runtime are immediately available to subsequent requests.
- **Deep cloning with `structuredClone()`:** The `ProductTemplate.clone()` method uses Node.js's built-in `structuredClone()` to deep-copy the `attributes` object, ensuring that nested data (arrays, objects) is truly independent between the prototype and its clone.
- **Controller customization flow:** The controller retrieves a template, clones it, and then imperatively applies customizations. This is a clean separation -- the Prototype pattern handles creation, and the controller handles request-specific logic.

The Prototype pattern in NestJS is particularly useful when combined with a database or configuration source: you can seed the registry from a database on module initialization and allow admin endpoints to add new templates at runtime.

## API Endpoints

### GET /prototype/templates

Lists all available product templates in the registry.

```bash
curl http://localhost:3000/prototype/templates
```

Expected response:

```json
[
  {
    "id": "basic-tshirt",
    "template": {
      "name": "Basic T-Shirt",
      "price": 19.99,
      "category": "apparel",
      "attributes": {
        "material": "cotton",
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["white", "black", "navy"],
        "care": "machine wash cold"
      }
    }
  },
  {
    "id": "premium-headphones",
    "template": {
      "name": "Premium Headphones",
      "price": 299.99,
      "category": "electronics",
      "attributes": {
        "type": "over-ear",
        "wireless": true,
        "noiseCancelling": true,
        "batteryLife": "30 hours",
        "driver": "40mm"
      }
    }
  },
  {
    "id": "ebook-template",
    "template": {
      "name": "E-Book Template",
      "price": 9.99,
      "category": "digital",
      "attributes": {
        "format": "PDF",
        "pages": 200,
        "language": "English",
        "drm": false,
        "downloadable": true
      }
    }
  }
]
```

### POST /prototype/products/clone/:id

Clones a template by ID and applies optional customizations.

**Clone with customizations:**

```bash
curl -X POST http://localhost:3000/prototype/products/clone/basic-tshirt \
  -H "Content-Type: application/json" \
  -d '{
    "customizations": {
      "name": "Red T-Shirt (Sale)",
      "price": 14.99,
      "attributes": {
        "colors": ["red"],
        "onSale": true
      }
    }
  }'
```

Expected response:

```json
{
  "clonedFrom": "basic-tshirt",
  "product": {
    "name": "Red T-Shirt (Sale)",
    "price": 14.99,
    "category": "apparel",
    "attributes": {
      "material": "cotton",
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["red"],
      "care": "machine wash cold",
      "onSale": true
    }
  }
}
```

**Clone without customizations:**

```bash
curl -X POST http://localhost:3000/prototype/products/clone/premium-headphones \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected response:

```json
{
  "clonedFrom": "premium-headphones",
  "product": {
    "name": "Premium Headphones",
    "price": 299.99,
    "category": "electronics",
    "attributes": {
      "type": "over-ear",
      "wireless": true,
      "noiseCancelling": true,
      "batteryLife": "30 hours",
      "driver": "40mm"
    }
  }
}
```

## Key Files

| File | Description |
|---|---|
| `product-prototype.interface.ts` | Defines the generic `Prototype<T>` interface with a single `clone()` method. |
| `product-template.ts` | The `ProductTemplate` class that implements `Prototype<ProductTemplate>` with deep cloning via `structuredClone()`. |
| `template-registry.service.ts` | Singleton service that stores named prototypes and provides `getTemplate()`, `addTemplate()`, and `listTemplates()` methods. |
| `prototype.controller.ts` | Controller with endpoints to list templates and clone products with optional customizations. |
| `prototype.module.ts` | NestJS module that registers the controller and `TemplateRegistryService` provider. |

## Related Patterns

- **Abstract Factory:** Can use Prototype internally to create products by cloning prototypes instead of calling constructors. The two patterns solve different problems but compose well.
- **Factory Method:** An alternative to Prototype. Factory Method uses inheritance (subclassing a creator) while Prototype uses composition (cloning an instance). Prototype avoids the need for a parallel creator hierarchy.
- **Singleton:** The `TemplateRegistryService` is itself a Singleton (NestJS default scope), demonstrating how Singleton and Prototype work together -- one instance of the registry manages all prototypes.
