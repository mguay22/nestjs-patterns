import { OrderState, OrderStateContext, StateTransitionResult } from './order-state.interface';
import { DeliveredState } from './delivered.state';

export class ShippedState implements OrderState {
  getName(): string {
    return 'Shipped';
  }

  confirm(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Cannot confirm from Shipped state — order is already in transit',
      newState: this.getName(),
    };
  }

  ship(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Order is already shipped',
      newState: this.getName(),
    };
  }

  deliver(context: OrderStateContext): StateTransitionResult {
    context.setState(new DeliveredState());
    return {
      success: true,
      message: 'Order delivered successfully',
      newState: 'Delivered',
    };
  }

  cancel(_context: OrderStateContext): StateTransitionResult {
    return {
      success: false,
      message: 'Cannot cancel from Shipped state — order is already in transit',
      newState: this.getName(),
    };
  }
}
