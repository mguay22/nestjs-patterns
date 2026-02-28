export interface StateTransitionResult {
  success: boolean;
  message: string;
  newState: string;
}

export interface OrderState {
  getName(): string;
  confirm(context: OrderStateContext): StateTransitionResult;
  ship(context: OrderStateContext): StateTransitionResult;
  deliver(context: OrderStateContext): StateTransitionResult;
  cancel(context: OrderStateContext): StateTransitionResult;
}

export interface OrderStateContext {
  setState(state: OrderState): void;
  getStateName(): string;
}
