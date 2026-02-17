# Facade Pattern

## Intent

Provide a unified interface to a set of interfaces in a subsystem, making the subsystem easier to use.

## Problem

Placing an order in an e-commerce platform involves multiple subsystems: checking inventory, processing payment, creating a shipment, and sending a confirmation notification. If the client (controller) had to orchestrate calls to `InventoryService`, `PaymentService`, `ShippingService`, and `NotificationService` directly, it would need to understand the correct sequence, handle errors from each subsystem, and coordinate data between them. This tight coupling makes the controller bloated and the workflow fragile.

## Solution

The Facade pattern introduces a single `OrderFacadeService` that encapsulates the entire order placement workflow. The client makes one call to `placeOrder()`, and the facade coordinates all four subsystems internally -- checking stock, processing payment, creating shipment, and sending confirmation -- in the correct order with proper error handling. The client remains simple and decoupled from subsystem details.

## Structure

- **Subsystem Classes** (`InventoryService`, `PaymentService`, `ShippingService`, `NotificationService`): Individual services that handle specific concerns. Each has its own interface and can be used independently.
- **Facade** (`OrderFacadeService`): Orchestrates the subsystem classes in the correct sequence. It depends on all four services and exposes a single `placeOrder()` method.
- **Client** (`FacadeController`): Interacts only with the facade, passing order data and receiving a unified response.

## E-Commerce Example

This implementation models a complete order placement workflow:

1. **Inventory Check** (`InventoryService.checkStock()`): Verifies that all requested items are in stock. Items with quantity greater than 100 are simulated as unavailable. If any items are out of stock, the facade throws a `BadRequestException` before proceeding.

2. **Payment Processing** (`PaymentService.processPayment()`): Charges the customer for the total order amount using the specified payment method. Returns a transaction ID like `TXN-CREDIT-1700000000000`.

3. **Shipment Creation** (`ShippingService.createShipment()`): Creates a shipping record for the items to be delivered. Returns a shipment ID, carrier (FedEx), and estimated delivery date (5 days from now).

4. **Confirmation Notification** (`NotificationService.sendConfirmation()`): Sends an order confirmation email to the customer with the order ID and total.

The `OrderFacadeService` runs these steps sequentially, checking for errors at each step, and returns a consolidated response containing results from all four subsystems.

## When to Use

- You want to provide a simple interface to a complex subsystem involving multiple interdependent services.
- You want to decouple client code from subsystem internals so that changes to the subsystems do not ripple outward.
- You need to define an entry point to each level of a layered architecture.
- You are orchestrating a multi-step workflow where the sequence and error handling should be centralized.
- You want to reduce the number of dependencies that client code must manage.

## When NOT to Use

- The subsystem is already simple enough that a facade would just be a pass-through with no added value.
- Clients need fine-grained control over individual subsystem operations that a facade would hide (though clients can still access subsystems directly alongside the facade).
- The facade risks becoming a "God object" that accumulates too many responsibilities -- at that point, consider splitting into multiple facades or using a different orchestration pattern.

## NestJS Integration

All subsystem services and the facade are registered as `@Injectable()` NestJS providers. The `OrderFacadeService` receives all four subsystem services through constructor injection, which NestJS resolves automatically from the module's provider list. The module exports `OrderFacadeService` so that other modules can use the simplified interface without needing to import or know about the individual subsystem services. This aligns naturally with NestJS's modular architecture, where the facade acts as the module's public API.

## API Endpoints

### POST /facade/place-order

Place a complete order in a single request.

**Request:**

```bash
curl -X POST http://localhost:3000/facade/place-order \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"name": "Wireless Headphones", "quantity": 2, "price": 79.99},
      {"name": "Phone Case", "quantity": 1, "price": 19.99}
    ],
    "shippingAddress": "123 Main St, Springfield, IL 62701",
    "paymentMethod": "credit",
    "customerEmail": "customer@example.com"
  }'
```

**Response:**

```json
{
  "orderId": "ORD-1700000000000",
  "status": "confirmed",
  "inventory": {
    "available": true,
    "unavailableItems": []
  },
  "payment": {
    "success": true,
    "transactionId": "TXN-CREDIT-1700000000000"
  },
  "shipping": {
    "shipmentId": "SHIP-1700000000000",
    "estimatedDelivery": "2024-01-20",
    "carrier": "FedEx"
  },
  "notification": {
    "sent": true,
    "messageId": "MSG-1700000000000"
  },
  "total": 179.97
}
```

**Error (out of stock):**

```bash
curl -X POST http://localhost:3000/facade/place-order \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"name": "Bulk Item", "quantity": 150, "price": 9.99}],
    "shippingAddress": "123 Main St",
    "paymentMethod": "credit",
    "customerEmail": "customer@example.com"
  }'
```

```json
{
  "statusCode": 400,
  "message": "Items out of stock: Bulk Item"
}
```

## Key Files

| File | Description |
|------|-------------|
| `inventory.service.ts` | Subsystem service that checks product stock availability |
| `payment.service.ts` | Subsystem service that processes payments and returns transaction IDs |
| `shipping.service.ts` | Subsystem service that creates shipments with carrier and delivery estimates |
| `notification.service.ts` | Subsystem service that sends order confirmation emails |
| `order-facade.service.ts` | Facade that orchestrates all four subsystems into a single `placeOrder()` call |
| `facade.controller.ts` | REST controller that delegates to the facade |
| `facade.module.ts` | NestJS module registering all providers and exporting the facade |

## Related Patterns

- **Adapter**: Adapter wraps a single object to change its interface, while Facade wraps an entire subsystem to simplify it. Adapter typically works with one class; Facade coordinates multiple classes.
- **Mediator**: Both reduce coupling between components. Facade defines a unidirectional simplified interface, while Mediator enables bidirectional communication between peer components that are aware of the mediator.
- **Abstract Factory**: Can be used as an alternative to Facade for hiding platform-specific classes, creating subsystem objects behind a factory interface.
