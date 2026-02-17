import { OrderState, OrderStateContext, StateTransitionResult } from './order-state.interface.js';
import { ShippedState } from './shipped.state.js';
import { CancelledState } from './cancelled.state.js';

export class ConfirmedState implements OrderState {
  getName(): string {
    return 'Confirmed';
  }

  confirm(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Order is already confirmed',
      newState: this.getName(),
    };
  }

  ship(context: OrderStateContext): StateTransitionResult {
    context.setState(new ShippedState());
    return {
      success: true,
      message: 'Order shipped successfully',
      newState: 'Shipped',
    };
  }

  deliver(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Cannot deliver from Confirmed state — order must be shipped first',
      newState: this.getName(),
    };
  }

  cancel(context: OrderStateContext): StateTransitionResult {
    context.setState(new CancelledState());
    return {
      success: true,
      message: 'Order cancelled from confirmed state — refund will be processed',
      newState: 'Cancelled',
    };
  }
}
