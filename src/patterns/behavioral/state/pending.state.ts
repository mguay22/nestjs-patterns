import { OrderState, OrderStateContext, StateTransitionResult } from './order-state.interface.js';
import { ConfirmedState } from './confirmed.state.js';
import { CancelledState } from './cancelled.state.js';

export class PendingState implements OrderState {
  getName(): string {
    return 'Pending';
  }

  confirm(context: OrderStateContext): StateTransitionResult {
    context.setState(new ConfirmedState());
    return {
      success: true,
      message: 'Order confirmed successfully',
      newState: 'Confirmed',
    };
  }

  ship(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Cannot ship from Pending state — order must be confirmed first',
      newState: this.getName(),
    };
  }

  deliver(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Cannot deliver from Pending state',
      newState: this.getName(),
    };
  }

  cancel(context: OrderStateContext): StateTransitionResult {
    context.setState(new CancelledState());
    return {
      success: true,
      message: 'Order cancelled from pending state',
      newState: 'Cancelled',
    };
  }
}
