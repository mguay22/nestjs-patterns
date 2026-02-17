# State

## Intent

Allow an object to alter its behavior when its internal state changes, making the object appear to change its class.

## Problem

An e-commerce order goes through multiple states -- pending, confirmed, shipped, delivered, cancelled -- and the available actions depend on the current state. Implementing this with conditional logic (`if/else` or `switch` statements) in every method leads to complex, error-prone code. Adding a new state requires modifying every method that checks the current state.

## Solution

The State pattern delegates state-specific behavior to individual state objects. The order context holds a reference to its current state and forwards all action requests to it. Each state object knows which transitions are valid and which are not, returning appropriate success or error results. Transitioning to a new state simply means swapping the state object inside the context.

## Structure

- **State (interface)** -- `OrderState`: Declares `getName()`, `confirm()`, `ship()`, `deliver()`, and `cancel()` methods.
- **Context** -- `OrderContext`: Holds the current state, delegates actions, and records a transition history.
- **Concrete States** -- `PendingState`, `ConfirmedState`, `ShippedState`, `DeliveredState`, `CancelledState`: Each implements the valid and invalid transitions for that state.
- **Service** -- `StateService`: Manages multiple order contexts by ID, creating and retrieving orders.

## E-Commerce Example

This implementation models an **order lifecycle state machine** with the following valid transitions:

```
Pending  --confirm-->  Confirmed  --ship-->  Shipped  --deliver-->  Delivered
Pending  --cancel-->   Cancelled
Confirmed --cancel-->  Cancelled
```

Invalid transitions return an error message explaining why the action is not allowed. For example:

- Shipping from `Pending` fails with "order must be confirmed first."
- Cancelling from `Shipped` fails with "order is already in transit."
- Any action from `Delivered` or `Cancelled` fails since these are terminal states.

The `OrderContext` records every transition attempt (successful or failed) in a history log with timestamps, enabling full audit trails. The `StateService` manages a `Map` of orders by ID, supporting multiple concurrent order state machines.

## When to Use

- An object's behavior depends on its state, and it must change behavior at runtime.
- Multiple methods contain conditional logic that depends on the object's state.
- State transitions follow well-defined rules that vary by current state.
- You want to make state transitions explicit and self-documenting.
- You need a complete audit trail of state changes.

## When NOT to Use

- The object has only two or three states with simple transitions -- a boolean flag or enum with a `switch` is clearer.
- State-specific behavior is minimal, making separate state classes overkill.
- State transitions are entirely data-driven and better modeled with a configuration table or finite state machine library.

## NestJS Integration

The `StateService` is an `@Injectable()` service that acts as a repository for order contexts. Each `OrderContext` is a plain TypeScript class that manages its own state internally. State classes are also plain TypeScript classes with no framework dependencies. Because the service is a singleton, all orders persist in memory across requests. The controller maps URL parameters (`:id` and `:action`) to service calls, providing a clean REST interface over the state machine.

## API Endpoints

### POST /state/orders

Creates a new order in the `Pending` state.

```bash
curl -X POST http://localhost:3000/state/orders \
  -H "Content-Type: application/json" \
  -d '{ "id": "ORD-001" }'
```

**Expected response:**

```json
{
  "orderId": "ORD-001",
  "currentState": "Pending",
  "history": [
    {
      "action": "create",
      "fromState": "None",
      "toState": "Pending",
      "success": true,
      "message": "Order created",
      "timestamp": "2026-02-16T12:00:00.000Z"
    }
  ]
}
```

### GET /state/orders/:id

Returns the current state and full history of an order.

```bash
curl http://localhost:3000/state/orders/ORD-001
```

### POST /state/orders/:id/:action

Performs a state transition. Valid actions: `confirm`, `ship`, `deliver`, `cancel`.

**Confirm an order:**

```bash
curl -X POST http://localhost:3000/state/orders/ORD-001/confirm
```

**Expected response:**

```json
{
  "success": true,
  "message": "Order confirmed successfully",
  "newState": "Confirmed",
  "order": {
    "orderId": "ORD-001",
    "currentState": "Confirmed",
    "history": [
      { "action": "create", "fromState": "None", "toState": "Pending", "success": true, "..." },
      { "action": "confirm", "fromState": "Pending", "toState": "Confirmed", "success": true, "..." }
    ]
  }
}
```

**Invalid transition example:**

```bash
curl -X POST http://localhost:3000/state/orders/ORD-001/deliver
```

**Expected response:**

```json
{
  "success": false,
  "message": "Cannot deliver from Confirmed state -- order must be shipped first",
  "newState": "Confirmed",
  "order": { "..." }
}
```

## Key Files

| File | Description |
|------|-------------|
| `order-state.interface.ts` | Defines `OrderState`, `StateTransitionResult`, and `OrderStateContext` interfaces |
| `order-context.ts` | Context class that holds the current state, delegates actions, and records history |
| `pending.state.ts` | Initial state; allows `confirm` and `cancel` |
| `confirmed.state.ts` | Allows `ship` and `cancel` |
| `shipped.state.ts` | Allows `deliver` only; cannot cancel in transit |
| `delivered.state.ts` | Terminal state; no transitions allowed |
| `cancelled.state.ts` | Terminal state; no transitions allowed |
| `state.service.ts` | Injectable service managing order contexts by ID |
| `state.controller.ts` | Exposes REST endpoints for order creation and state transitions |
| `state.module.ts` | NestJS module registering the controller and state service |

## Related Patterns

- **Strategy** -- Both delegate behavior to interchangeable objects, but State transitions happen automatically based on internal conditions while Strategy is typically set by the client.
- **State Machine / Finite Automaton** -- The State pattern is an object-oriented implementation of a finite state machine.
- **Command** -- State transitions can be encapsulated as commands for undo support.
