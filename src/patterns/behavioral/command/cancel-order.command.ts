import { Command, CommandResult } from './command.interface';

export class CancelOrderCommand implements Command {
  readonly name = 'CancelOrder';
  private executed = false;

  constructor(
    private readonly orderId: string,
    private readonly reason?: string,
  ) {}

  execute(): CommandResult {
    if (this.executed) {
      return {
        success: false,
        message: `Order ${this.orderId} has already been cancelled`,
      };
    }

    this.executed = true;

    return {
      success: true,
      message: `Order ${this.orderId} cancelled successfully`,
      data: {
        orderId: this.orderId,
        reason: this.reason ?? 'No reason provided',
        status: 'cancelled',
        timestamp: new Date().toISOString(),
      },
    };
  }

  undo(): CommandResult {
    if (!this.executed) {
      return {
        success: false,
        message: `Order ${this.orderId} was never cancelled — cannot undo`,
      };
    }

    this.executed = false;

    return {
      success: true,
      message: `Order ${this.orderId} cancellation reversed — order restored`,
      data: {
        orderId: this.orderId,
        status: 'restored',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
