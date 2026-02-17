import { Command, CommandResult } from './command.interface.js';

export class PlaceOrderCommand implements Command {
  readonly name = 'PlaceOrder';
  private executed = false;

  constructor(
    private readonly orderId: string,
    private readonly amount: number,
  ) {}

  execute(): CommandResult {
    if (this.executed) {
      return {
        success: false,
        message: `Order ${this.orderId} has already been placed`,
      };
    }

    this.executed = true;

    return {
      success: true,
      message: `Order ${this.orderId} placed successfully`,
      data: {
        orderId: this.orderId,
        amount: this.amount,
        status: 'placed',
        timestamp: new Date().toISOString(),
      },
    };
  }

  undo(): CommandResult {
    if (!this.executed) {
      return {
        success: false,
        message: `Order ${this.orderId} was never placed — cannot undo`,
      };
    }

    this.executed = false;

    return {
      success: true,
      message: `Order ${this.orderId} placement reversed`,
      data: {
        orderId: this.orderId,
        status: 'reversed',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
