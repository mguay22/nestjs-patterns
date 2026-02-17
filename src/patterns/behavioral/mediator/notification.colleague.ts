import { Colleague } from './colleague.interface';

export class NotificationColleague extends Colleague {
  getName(): string {
    return 'Notification';
  }

  sendOrderConfirmation(email: string, orderId: string, trackingNumber: string): {
    success: boolean;
    message: string;
  } {
    const result = {
      success: true,
      message: `Order confirmation sent to ${email} for order ${orderId} (tracking: ${trackingNumber})`,
    };

    this.mediator.notify(this.getName(), 'notification.sent', result);

    return result;
  }

  sendPaymentReceipt(email: string, transactionId: string, amount: number): {
    success: boolean;
    message: string;
  } {
    return {
      success: true,
      message: `Payment receipt for $${amount.toFixed(2)} sent to ${email} (txn: ${transactionId})`,
    };
  }
}
