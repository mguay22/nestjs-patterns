import { Command, CommandResult } from './command.interface';

export class RefundOrderCommand implements Command {
  readonly name = 'RefundOrder';
  private executed = false;

  constructor(
    private readonly orderId: string,
    private readonly amount?: number,
    private readonly reason?: string,
  ) {}

  execute(): CommandResult {
    if (this.executed) {
      return {
        success: false,
        message: `Refund for order ${this.orderId} has already been processed`,
      };
    }

    this.executed = true;

    return {
      success: true,
      message: `Refund for order ${this.orderId} processed successfully`,
      data: {
        orderId: this.orderId,
        refundAmount: this.amount ?? 0,
        reason: this.reason ?? 'No reason provided',
        status: 'refunded',
        timestamp: new Date().toISOString(),
      },
    };
  }

  undo(): CommandResult {
    if (!this.executed) {
      return {
        success: false,
        message: `No refund was issued for order ${this.orderId} — cannot undo`,
      };
    }

    this.executed = false;

    return {
      success: true,
      message: `Refund for order ${this.orderId} reversed — funds reclaimed`,
      data: {
        orderId: this.orderId,
        reclaimedAmount: this.amount ?? 0,
        status: 'refund_reversed',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
