import { OrderState, OrderStateContext, StateTransitionResult } from './order-state.interface';
import { PendingState } from './pending.state';

export interface HistoryEntry {
  action: string;
  fromState: string;
  toState: string;
  success: boolean;
  message: string;
  timestamp: string;
}

export class OrderContext implements OrderStateContext {
  private state: OrderState;
  private readonly history: HistoryEntry[] = [];
  readonly orderId: string;

  constructor(orderId: string) {
    this.orderId = orderId;
    this.state = new PendingState();
    this.history.push({
      action: 'create',
      fromState: 'None',
      toState: 'Pending',
      success: true,
      message: 'Order created',
      timestamp: new Date().toISOString(),
    });
  }

  setState(state: OrderState): void {
    this.state = state;
  }

  getStateName(): string {
    return this.state.getName();
  }

  confirm(): StateTransitionResult {
    const fromState = this.state.getName();
    const result = this.state.confirm(this);
    this.recordHistory('confirm', fromState, result);
    return result;
  }

  ship(): StateTransitionResult {
    const fromState = this.state.getName();
    const result = this.state.ship(this);
    this.recordHistory('ship', fromState, result);
    return result;
  }

  deliver(): StateTransitionResult {
    const fromState = this.state.getName();
    const result = this.state.deliver(this);
    this.recordHistory('deliver', fromState, result);
    return result;
  }

  cancel(): StateTransitionResult {
    const fromState = this.state.getName();
    const result = this.state.cancel(this);
    this.recordHistory('cancel', fromState, result);
    return result;
  }

  getHistory(): HistoryEntry[] {
    return [...this.history];
  }

  getStatus() {
    return {
      orderId: this.orderId,
      currentState: this.state.getName(),
      history: this.getHistory(),
    };
  }

  private recordHistory(action: string, fromState: string, result: StateTransitionResult): void {
    this.history.push({
      action,
      fromState,
      toState: result.newState,
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString(),
    });
  }
}
