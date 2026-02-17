# Mediator

## Intent

Define an object that encapsulates how a set of objects interact, promoting loose coupling by keeping objects from referring to each other explicitly and letting you vary their interaction independently.

## Problem

Placing an order in an e-commerce system involves coordinating multiple subsystems: inventory must be reserved, payment must be processed, shipping must be arranged, and notifications must be sent. If each subsystem communicates directly with the others, the resulting web of dependencies becomes difficult to understand, maintain, and modify. Adding a new subsystem requires updating all existing ones.

## Solution

The Mediator pattern introduces a central coordinator -- the `OrderMediatorService` -- that manages the interactions between subsystems (colleagues). Each colleague knows only about the mediator, not about the other colleagues. The mediator orchestrates the multi-step order placement workflow, handling the sequence and error recovery (e.g., releasing inventory if payment fails).

## Structure

- **Mediator (interface)** -- `Mediator`: Declares `notify(sender, event, data)` for receiving colleague events.
- **Concrete Mediator** -- `OrderMediatorService`: Implements the mediator interface, orchestrates the order workflow, and logs all events.
- **Colleague (abstract)** -- `Colleague`: Base class that holds a reference to the mediator via `setMediator()`.
- **Concrete Colleagues** -- `InventoryColleague`, `PaymentColleague`, `ShippingColleague`, `NotificationColleague`: Each handles one aspect of order processing and notifies the mediator when actions complete.

## E-Commerce Example

This implementation models a **multi-step order placement workflow** coordinating four subsystems:

1. **InventoryColleague** -- Reserves items in inventory. If reservation fails, the workflow stops. Also supports releasing items on rollback.
2. **PaymentColleague** -- Processes payment via the specified method and generates a transaction ID. If payment fails, reserved inventory is released.
3. **ShippingColleague** -- Creates a shipment with a tracking number and estimated delivery date (5 days out).
4. **NotificationColleague** -- Sends an order confirmation email with the tracking number, and a payment receipt with the transaction details.

The `OrderMediatorService` orchestrates these steps sequentially. Each colleague notifies the mediator upon completion, building an event log that captures the complete workflow timeline. The mediator returns the order ID, total amount, transaction ID, tracking number, delivery estimate, and the full workflow trace.

## When to Use

- Multiple objects need to communicate, and direct references between them create a tangled dependency graph.
- You want to centralize complex coordination logic in a single place.
- You need to easily change the interaction behavior without modifying the individual objects.
- Subsystems should be reusable independently of the specific workflow they participate in.
- You need an audit trail of all inter-object communications.

## When NOT to Use

- There are only two objects communicating -- direct coupling is simpler and clearer.
- The mediator risks becoming a "God object" that absorbs too much logic from the colleagues.
- The interaction between objects is simple and unlikely to change.

## NestJS Integration

The `OrderMediatorService` is an `@Injectable()` service that serves as the concrete mediator. It creates and wires up all colleague instances in its constructor, setting itself as the mediator on each colleague. The mediator is exported from `MediatorModule` so other modules can trigger the order placement workflow. The event log provides built-in observability without requiring additional infrastructure.

## API Endpoints

### POST /mediator/orders

Places an order by coordinating inventory, payment, shipping, and notification subsystems.

```bash
curl -X POST http://localhost:3000/mediator/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "name": "Laptop", "qty": 1, "price": 999.99 },
      { "name": "Mouse", "qty": 2, "price": 29.99 }
    ],
    "paymentMethod": "credit_card",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Springfield",
      "country": "US"
    },
    "customerEmail": "customer@example.com"
  }'
```

**Expected response:**

```json
{
  "success": true,
  "orderId": "ORD_1708099200000_abc123",
  "totalAmount": 1059.97,
  "transactionId": "txn_1708099200000_xyz789",
  "trackingNumber": "SHIP_1708099200000_def456",
  "estimatedDelivery": "2026-02-21",
  "notification": "Order confirmation sent to customer@example.com for order ORD_... (tracking: SHIP_...)",
  "workflow": [
    { "step": "inventory.reserved", "handler": "Inventory", "timestamp": "..." },
    { "step": "payment.processed", "handler": "Payment", "timestamp": "..." },
    { "step": "shipping.created", "handler": "Shipping", "timestamp": "..." },
    { "step": "notification.sent", "handler": "Notification", "timestamp": "..." }
  ]
}
```

## Key Files

| File | Description |
|------|-------------|
| `mediator.interface.ts` | Defines the `Mediator` interface with the `notify()` method |
| `colleague.interface.ts` | Abstract base class for colleagues with `setMediator()` |
| `inventory.colleague.ts` | Reserves and releases inventory items |
| `payment.colleague.ts` | Processes and refunds payments, generates transaction IDs |
| `shipping.colleague.ts` | Creates shipments with tracking numbers and delivery estimates |
| `notification.colleague.ts` | Sends order confirmation and payment receipt emails |
| `order-mediator.service.ts` | Injectable mediator that orchestrates the order workflow |
| `mediator.controller.ts` | Exposes the `POST /mediator/orders` endpoint |
| `mediator.module.ts` | NestJS module registering the controller and mediator service |

## Related Patterns

- **Observer** -- Mediator centralizes communication in one object; Observer distributes it through event subscriptions. Often used together -- the mediator can use observer-style events internally.
- **Facade** -- Both simplify interactions with a subsystem, but Facade provides a one-way simplified interface while Mediator enables two-way communication between colleagues.
- **Command** -- Commands can be routed through a mediator to coordinate multi-step workflows.
