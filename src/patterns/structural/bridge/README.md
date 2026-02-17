# Bridge Pattern

## Intent

Decouple an abstraction from its implementation so that the two can vary independently.

## Problem

An e-commerce platform needs to send different types of notifications (order confirmations, shipping updates) through different channels (email, SMS, push notifications). Without the Bridge pattern, you would need a separate class for every combination -- `OrderConfirmationEmail`, `OrderConfirmationSms`, `ShippingUpdatePush`, and so on. This leads to a combinatorial explosion of classes that becomes unmanageable as new notification types or channels are added.

## Solution

The Bridge pattern splits the problem into two independent hierarchies: the **abstraction** (notification types) and the **implementation** (delivery channels). The abstraction holds a reference to an implementation object and delegates the actual sending to it. New notification types can be added without touching channel code, and new channels can be added without touching notification code.

## Structure

- **Implementor Interface** (`NotificationSender`): Defines the `send(to, subject, body)` method that all delivery channels must implement.
- **Concrete Implementors** (`EmailSender`, `SmsSender`, `PushSender`): Each implements `NotificationSender` for a specific delivery channel.
- **Abstraction** (`Notification`): An abstract class that holds a reference to a `NotificationSender`. It defines the `notify(to)` template method, which calls `buildSubject()` and `buildBody()` (abstract) and delegates sending to the sender.
- **Refined Abstractions** (`OrderConfirmationNotification`, `ShippingUpdateNotification`): Concrete subclasses that provide specific subject and body content for each notification type.
- **Client** (`BridgeController`): Resolves the appropriate sender and notification type at runtime, then calls `notify()`.

## E-Commerce Example

This implementation models a notification system for an e-commerce platform. When an order is placed or shipped, the system needs to notify the customer. The notification type determines the content (subject and body), while the channel determines how it is delivered.

`OrderConfirmationNotification` builds a subject like "Order Confirmation - #ORD-123" and a body thanking the customer. `ShippingUpdateNotification` builds a subject like "Shipping Update - Order #ORD-123" with tracking information. These are independent from the delivery mechanism.

`EmailSender`, `SmsSender`, and `PushSender` each implement the `NotificationSender` interface, formatting the output appropriately for their channel. The controller dynamically pairs any notification type with any channel based on the request payload, achieving the full combinatorial flexibility without a class for every combination.

## When to Use

- You want to avoid a combinatorial explosion of classes when you have two or more independent dimensions of variation.
- You need to switch implementations at runtime (e.g., choosing email vs. SMS based on user preferences).
- Both the abstraction and its implementation should be extensible through subclassing independently.
- Changes in the implementation should not require changes to the abstraction or its clients.
- You want to share an implementation among multiple abstraction objects.

## When NOT to Use

- There is only one dimension of variation -- using Bridge would add unnecessary complexity for a problem that a simple interface and implementations can solve.
- The abstraction and implementation are unlikely to change independently, making the extra layer of indirection wasteful.
- The relationship between the two hierarchies is so tightly coupled that separating them would require constant coordination, negating the pattern's benefits.

## NestJS Integration

The `BridgeController` is registered as the module's controller. Unlike the Adapter pattern where adaptees are injected as providers, this implementation creates sender and notification instances on-demand within the controller based on request parameters. This demonstrates that the Bridge pattern does not require all participants to be NestJS-managed singletons -- the key structural relationship (abstraction holding a reference to an implementor) is established at request time. In a production system, the senders could be registered as NestJS providers and injected into a service.

## API Endpoints

### POST /bridge/notifications

Send a notification of a given type through a specified channel.

**Request:**

```bash
curl -X POST http://localhost:3000/bridge/notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "order-confirmation", "channel": "email", "to": "customer@example.com", "orderId": "ORD-42"}'
```

**Response:**

```json
{
  "channel": "email",
  "recipient": "customer@example.com",
  "status": "Email sent to customer@example.com with subject \"Order Confirmation - #ORD-42\""
}
```

**Request (SMS shipping update):**

```bash
curl -X POST http://localhost:3000/bridge/notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "shipping-update", "channel": "sms", "to": "+15551234567", "orderId": "ORD-42"}'
```

**Response:**

```json
{
  "channel": "sms",
  "recipient": "+15551234567",
  "status": "SMS sent to +15551234567: Shipping Update - Order #ORD-42 - Your order #ORD-42 has been shipped and is on its way. Track your shipment for real-time updates."
}
```

**Request (Push notification):**

```bash
curl -X POST http://localhost:3000/bridge/notifications \
  -H "Content-Type: application/json" \
  -d '{"type": "order-confirmation", "channel": "push", "to": "device-token-abc", "orderId": "ORD-99"}'
```

**Response:**

```json
{
  "channel": "push",
  "recipient": "device-token-abc",
  "status": "Push notification sent to device-token-abc: Order Confirmation - #ORD-99"
}
```

## Key Files

| File | Description |
|------|-------------|
| `notification-sender.interface.ts` | Defines the `NotificationSender` implementor interface and `NotificationResult` type |
| `email-sender.ts` | Concrete implementor for the email delivery channel |
| `sms-sender.ts` | Concrete implementor for the SMS delivery channel |
| `push-sender.ts` | Concrete implementor for the push notification delivery channel |
| `notification.ts` | Abstract `Notification` class (abstraction) that bridges to a `NotificationSender` |
| `order-confirmation.notification.ts` | Refined abstraction for order confirmation content |
| `shipping-update.notification.ts` | Refined abstraction for shipping update content |
| `bridge.controller.ts` | REST controller that resolves the sender and notification type at runtime |
| `bridge.module.ts` | NestJS module registering the controller |

## Related Patterns

- **Adapter**: Adapter is applied after the system is designed to make incompatible interfaces work together. Bridge is designed upfront to let abstraction and implementation vary independently.
- **Strategy**: Strategy encapsulates interchangeable algorithms behind a common interface, similar to the implementor side of Bridge. However, Bridge also has an abstraction hierarchy, making it a two-dimensional separation rather than Strategy's single dimension.
- **Abstract Factory**: Can be used alongside Bridge to create the concrete implementor objects, hiding the instantiation logic from the client.
