import { OrderState, OrderStateContext, StateTransitionResult } from './order-state.interface';

export class DeliveredState implements OrderState {
  getName(): string {
    return 'Delivered';
  }

  confirm(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Cannot confirm from Delivered state — order is already delivered',
      newState: this.getName(),
    };
  }

  ship(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Cannot ship from Delivered state — order is already delivered',
      newState: this.getName(),
    };
  }

  deliver(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Order is already delivered',
      newState: this.getName(),
    };
  }

  cancel(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Cannot cancel from Delivered state — order is already delivered',
      newState: this.getName(),
    };
  }
}
