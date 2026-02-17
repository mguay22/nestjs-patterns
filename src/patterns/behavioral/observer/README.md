# Observer

## Intent

Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

## Problem

When a customer places an order in an e-commerce system, multiple subsystems need to react: inventory must be decremented, analytics must record the sale, and a confirmation email must be sent. If the order service calls each subsystem directly, it becomes tightly coupled to all of them. Adding a new reaction (e.g., loyalty points) requires modifying the order service code.

## Solution

The Observer pattern decouples the order service from its dependents by using an event-driven architecture. The order service publishes an `order.created` event, and independent observer services subscribe to that event. Each observer reacts in its own way without the order service knowing about any of them. New observers can be added simply by registering a new subscriber.

## Structure

- **Subject / Publisher** -- `OrderService`: Creates the order and emits the `order.created` event via `EventEmitter2`.
- **Event** -- `OrderCreatedEvent`: Carries the order data (ID, items, total, customer email, timestamp).
- **Concrete Observers / Subscribers** -- `InventoryObserver`, `AnalyticsObserver`, `EmailObserver`: Each listens for `order.created` and performs its own action.

## E-Commerce Example

This implementation models **order creation with automatic notifications** to multiple subsystems:

- **OrderService** -- Generates a unique order ID, calculates the total from items, creates an `OrderCreatedEvent`, and emits it using NestJS `EventEmitter2`.
- **InventoryObserver** -- Listens for `order.created` and logs stock reduction for each item in the order.
- **AnalyticsObserver** -- Listens for `order.created` and logs revenue tracking data including customer, item count, and timestamp.
- **EmailObserver** -- Listens for `order.created` and logs the sending of a confirmation email with order ID, total, and item names.

All three observers are registered as `@Injectable()` providers in the module and use the `@OnEvent('order.created')` decorator to subscribe. The order service has zero knowledge of which observers exist.

## When to Use

- Multiple objects need to react when another object's state changes.
- You want to decouple the object that triggers changes from the objects that respond to them.
- The set of observers needs to change at runtime or across deployments.
- You are building an event-driven or reactive architecture.
- New reactions to events should be addable without modifying the event source.

## When NOT to Use

- There is only one subscriber -- a direct method call is simpler and more transparent.
- The order of observer execution matters and must be strictly controlled -- the observer pattern does not guarantee order.
- Observers need to return results to the publisher -- consider the Mediator pattern instead.

## NestJS Integration

This implementation leverages NestJS's built-in `@nestjs/event-emitter` package, which provides `EventEmitter2` for publishing events and the `@OnEvent()` decorator for subscribing. This is a natural fit because NestJS's event emitter is itself an implementation of the Observer pattern. The `ObserverModule` imports `EventEmitterModule.forRoot()` to initialize the event system. Each observer is simply an `@Injectable()` service registered as a provider -- NestJS automatically discovers and wires up the `@OnEvent` handlers.

## API Endpoints

### POST /observer/orders

Creates an order and notifies all registered observers.

```bash
curl -X POST http://localhost:3000/observer/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "name": "Laptop", "price": 999.99, "quantity": 1 },
      { "name": "Mouse", "price": 29.99, "quantity": 2 }
    ],
    "customerEmail": "customer@example.com"
  }'
```

**Expected response:**

```json
{
  "orderId": "ORD_1708099200000_abc123",
  "totalAmount": 1059.97,
  "timestamp": "2026-02-16T12:00:00.000Z",
  "message": "Order created, observers notified"
}
```

**Server logs (observers reacting):**

```
[InventoryObserver] Updating inventory for order ORD_...: 2 item(s)
[InventoryObserver]   - Reducing stock for "Laptop" by 1
[InventoryObserver]   - Reducing stock for "Mouse" by 2
[InventoryObserver] Inventory update complete for order ORD_...
[AnalyticsObserver] Tracking analytics for order ORD_...: $1059.97 revenue
[AnalyticsObserver]   - Customer: customer@example.com
[EmailObserver] Sending order confirmation email to customer@example.com
[EmailObserver]   - Order ID: ORD_...
[EmailObserver]   - Total: $1059.97
[EmailObserver]   - Items: Laptop, Mouse
[EmailObserver] Email sent successfully to customer@example.com
```

## Key Files

| File | Description |
|------|-------------|
| `order-event.ts` | `OrderCreatedEvent` class carrying order data for observers |
| `order.service.ts` | Subject/publisher that creates orders and emits events via `EventEmitter2` |
| `inventory.observer.ts` | Observer that logs inventory stock reductions |
| `analytics.observer.ts` | Observer that logs revenue and analytics data |
| `email.observer.ts` | Observer that logs order confirmation email sending |
| `observer.controller.ts` | Exposes the `POST /observer/orders` endpoint |
| `observer.module.ts` | NestJS module importing `EventEmitterModule` and registering all providers |

## Related Patterns

- **Mediator** -- Mediator centralizes inter-object communication in one coordinator; Observer distributes it through publish/subscribe. They address similar coupling problems differently.
- **Command** -- Events can carry command objects, combining the two patterns for event-driven command execution.
- **Chain of Responsibility** -- Both decouple senders from receivers; Chain of Responsibility passes along a chain while Observer broadcasts to all subscribers simultaneously.
