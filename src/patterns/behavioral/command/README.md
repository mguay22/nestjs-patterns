# Command

## Intent

Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.

## Problem

In an e-commerce system, order operations such as placing, cancelling, and refunding orders each require different logic. When these operations are invoked directly, there is no way to maintain a history, undo a recent action, or queue operations for later execution. The calling code becomes tightly coupled to the specific operation logic.

## Solution

The Command pattern wraps each operation in a self-contained command object that implements `execute()` and `undo()`. An invoker service manages execution, maintains a stack of executed commands for undo support, and records a full history log. The controller simply creates the appropriate command and hands it to the invoker.

## Structure

- **Command (interface)** -- `Command`: Declares `execute()` and `undo()` methods plus a `name` identifier.
- **Concrete Commands** -- `PlaceOrderCommand`, `CancelOrderCommand`, `RefundOrderCommand`: Each encapsulates the data and logic for a specific order operation, with full undo support.
- **Invoker** -- `OrderCommandInvokerService`: Executes commands, maintains the undo stack, and records history entries.
- **Client** -- `CommandController`: Creates the appropriate command based on the request and delegates to the invoker.

## E-Commerce Example

This implementation models **order lifecycle operations** with undo support:

- **PlaceOrderCommand** -- Places an order with a given ID and amount. Undo reverses the placement.
- **CancelOrderCommand** -- Cancels an order with an optional reason. Undo restores the order.
- **RefundOrderCommand** -- Processes a refund for a given amount with an optional reason. Undo reclaims the refunded funds.

Each command tracks its own execution state to prevent double-execution. The `OrderCommandInvokerService` pushes successful commands onto a stack, enabling the most recent operation to be undone. Every execute and undo action is recorded in a chronological history log.

## When to Use

- You need undo/redo functionality for operations.
- Operations should be queued, logged, or scheduled for later execution.
- You want to decouple the object that invokes an operation from the one that performs it.
- You need to support transactional behavior where operations can be rolled back.
- You want a complete audit trail of all actions performed.

## When NOT to Use

- Operations are simple and do not require undo, logging, or queuing -- a direct method call is simpler.
- The overhead of creating command objects for every action is unjustified by the complexity of the application.
- Operations are not naturally reversible, making `undo()` implementations misleading.

## NestJS Integration

The `OrderCommandInvokerService` is an `@Injectable()` service that NestJS manages as a singleton, preserving the command stack and history across requests. The controller maps HTTP actions to concrete command classes, acting as the client in the pattern. The module exports the invoker service so other modules can programmatically execute commands.

## API Endpoints

### POST /command/orders/:action

Executes an order command. The `:action` parameter must be `place`, `cancel`, or `refund`.

**Place an order:**

```bash
curl -X POST http://localhost:3000/command/orders/place \
  -H "Content-Type: application/json" \
  -d '{ "orderId": "ORD-001", "amount": 249.99 }'
```

**Expected response:**

```json
{
  "action": "place",
  "result": {
    "success": true,
    "message": "Order ORD-001 placed successfully",
    "data": {
      "orderId": "ORD-001",
      "amount": 249.99,
      "status": "placed",
      "timestamp": "2026-02-16T12:00:00.000Z"
    }
  }
}
```

**Cancel an order:**

```bash
curl -X POST http://localhost:3000/command/orders/cancel \
  -H "Content-Type: application/json" \
  -d '{ "orderId": "ORD-001", "reason": "Changed my mind" }'
```

**Refund an order:**

```bash
curl -X POST http://localhost:3000/command/orders/refund \
  -H "Content-Type: application/json" \
  -d '{ "orderId": "ORD-002", "amount": 49.99, "reason": "Defective product" }'
```

### POST /command/orders/undo

Undoes the most recently executed command.

```bash
curl -X POST http://localhost:3000/command/orders/undo
```

**Expected response:**

```json
{
  "result": {
    "success": true,
    "message": "Order ORD-001 cancellation reversed -- order restored",
    "data": {
      "orderId": "ORD-001",
      "status": "restored",
      "timestamp": "2026-02-16T12:01:00.000Z"
    }
  }
}
```

### GET /command/orders/history

Returns the full chronological history of all executed and undone commands.

```bash
curl http://localhost:3000/command/orders/history
```

**Expected response:**

```json
{
  "history": [
    {
      "commandName": "PlaceOrder",
      "action": "execute",
      "result": { "success": true, "message": "Order ORD-001 placed successfully", "data": { "..." } },
      "timestamp": "2026-02-16T12:00:00.000Z"
    }
  ]
}
```

## Key Files

| File | Description |
|------|-------------|
| `command.interface.ts` | Defines the `Command` interface with `execute()`, `undo()`, and `name` |
| `place-order.command.ts` | Command to place an order; undo reverses the placement |
| `cancel-order.command.ts` | Command to cancel an order; undo restores it |
| `refund-order.command.ts` | Command to refund an order; undo reclaims refunded funds |
| `order-command-invoker.service.ts` | Injectable invoker that manages the command stack and history |
| `command.controller.ts` | Maps HTTP requests to command creation and invocation |
| `command.module.ts` | NestJS module registering the controller and invoker service |

## Related Patterns

- **Memento** -- Often used together with Command to store state snapshots for undo, while Command encapsulates the operation itself.
- **Strategy** -- Both encapsulate algorithms/actions as objects, but Strategy replaces behavior at runtime while Command focuses on parameterizing, queuing, and undoing requests.
- **Chain of Responsibility** -- Commands can be passed through a chain of handlers for routing or approval before execution.
