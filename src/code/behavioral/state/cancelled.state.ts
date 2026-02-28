import { OrderState, OrderStateContext, StateTransitionResult } from './order-state.interface';

export class CancelledState implements OrderState {
  getName(): string {
    return 'Cancelled';
  }

  confirm(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Cannot confirm from Cancelled state — order has been cancelled',
      newState: this.getName(),
    };
  }

  ship(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Cannot ship from Cancelled state — order has been cancelled',
      newState: this.getName(),
    };
  }

  deliver(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Cannot deliver from Cancelled state — order has been cancelled',
      newState: this.getName(),
    };
  }

  cancel(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Order is already cancelled',
      newState: this.getName(),
    };
  }
}
