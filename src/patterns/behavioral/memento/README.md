# Memento

## Intent

Without violating encapsulation, capture and externalize an object's internal state so that the object can be restored to this state later.

## Problem

A shopping cart in an e-commerce application changes frequently as customers add and remove items. Users expect the ability to undo recent changes -- perhaps they accidentally removed an item or want to revert to a previous cart configuration. Storing the cart's internal state directly in external code would break encapsulation and create tight coupling to the cart's data structure.

## Solution

The Memento pattern lets the shopping cart create opaque snapshot objects (mementos) of its own state. A caretaker service stores these snapshots in undo and redo stacks. When the user triggers an undo, the caretaker retrieves the previous memento and asks the cart to restore itself, all without the caretaker ever inspecting or depending on the cart's internal structure.

## Structure

- **Originator** -- `ShoppingCart`: Creates mementos via `save()` and restores itself from mementos via `restore()`.
- **Memento** -- `CartMemento`: An immutable snapshot of the cart's items at a point in time, with a timestamp.
- **Caretaker** -- `CartHistoryService`: Manages the undo and redo stacks, coordinates saving state before mutations, and performs restore operations.

## E-Commerce Example

This implementation models a **shopping cart with undo/redo support**:

- **ShoppingCart** -- Holds a list of `CartItem` objects (name, price, quantity). Supports `addItem()`, `removeItem()`, `save()`, and `restore()`. When adding an item that already exists, the quantities are merged.
- **CartMemento** -- Stores a deep copy of the cart's items along with a timestamp. Provides `getItems()`, `getTimestamp()`, and `getTotal()` accessors.
- **CartHistoryService** -- Before each mutation, the controller saves the current state as a memento and pushes it onto the undo stack. Undo pops from the undo stack and pushes the current state onto the redo stack. Redo does the inverse. The history endpoint shows all saved snapshots.

## When to Use

- You need undo/redo functionality that preserves encapsulation.
- You want to take snapshots of an object's state for later restoration.
- Direct access to the object's internal fields would violate encapsulation boundaries.
- The object's state is complex enough that saving/restoring requires a dedicated mechanism.
- You need a browsable history of past states.

## When NOT to Use

- The object's state is trivially simple (a single value) -- storing it in a variable is sufficient.
- Snapshots would consume too much memory because the state is very large (consider differential snapshots instead).
- The application does not require undo/redo or state restoration features.

## NestJS Integration

The `CartHistoryService` is an `@Injectable()` service acting as the caretaker. It owns the `ShoppingCart` instance and manages the undo/redo stacks. Because NestJS services are singletons by default, the cart state and history persist across HTTP requests within the application's lifetime. The controller delegates all state management to the service, keeping endpoint handlers thin.

## API Endpoints

### GET /memento/cart

Returns the current cart contents and total.

```bash
curl http://localhost:3000/memento/cart
```

**Expected response:**

```json
{
  "items": [],
  "total": 0
}
```

### POST /memento/cart/add

Adds an item to the cart. Automatically saves a snapshot before the mutation.

```bash
curl -X POST http://localhost:3000/memento/cart/add \
  -H "Content-Type: application/json" \
  -d '{ "name": "Laptop", "price": 999.99, "quantity": 1 }'
```

**Expected response:**

```json
{
  "message": "Added 1x \"Laptop\" to cart",
  "items": [
    { "name": "Laptop", "price": 999.99, "quantity": 1 }
  ],
  "total": 999.99
}
```

### POST /memento/cart/undo

Restores the cart to the previous saved state.

```bash
curl -X POST http://localhost:3000/memento/cart/undo
```

**Expected response:**

```json
{
  "message": "Undo successful -- restored to previous state",
  "restoredTo": "2026-02-16T12:00:00.000Z",
  "items": [],
  "total": 0
}
```

### POST /memento/cart/redo

Re-applies a previously undone state change.

```bash
curl -X POST http://localhost:3000/memento/cart/redo
```

**Expected response:**

```json
{
  "message": "Redo successful -- restored forward state",
  "restoredTo": "2026-02-16T12:00:05.000Z",
  "items": [
    { "name": "Laptop", "price": 999.99, "quantity": 1 }
  ],
  "total": 999.99
}
```

### GET /memento/cart/history

Returns all saved snapshots in the undo stack along with the current cart state.

```bash
curl http://localhost:3000/memento/cart/history
```

**Expected response:**

```json
{
  "snapshots": [
    { "timestamp": "2026-02-16T12:00:00.000Z", "itemCount": 0, "total": 0 }
  ],
  "currentCart": {
    "items": [
      { "name": "Laptop", "price": 999.99, "quantity": 1 }
    ],
    "total": 999.99
  }
}
```

## Key Files

| File | Description |
|------|-------------|
| `cart-memento.ts` | Memento class that stores an immutable snapshot of cart items with a timestamp |
| `shopping-cart.ts` | Originator class with `addItem()`, `removeItem()`, `save()`, and `restore()` |
| `cart-history.service.ts` | Injectable caretaker managing undo/redo stacks and the cart instance |
| `memento.controller.ts` | Exposes endpoints for cart operations, undo, redo, and history |
| `memento.module.ts` | NestJS module registering the controller and history service |

## Related Patterns

- **Command** -- Command encapsulates operations and supports undo through reverse execution; Memento supports undo through state snapshots. They are often used together.
- **Iterator** -- Can be used to iterate over a history of mementos.
- **Prototype** -- Memento uses deep copying (prototype-like cloning) to create independent snapshots of state.
