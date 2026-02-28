import { Colleague } from './colleague.interface';

export class PaymentColleague extends Colleague {
  getName(): string {
    return 'Payment';
  }

  processPayment(paymentMethod: string, amount: number): {
    success: boolean;
    transactionId: string;
    message: string;
  } {
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const result = {
      success: true,
      transactionId,
      message: `Payment of $${amount.toFixed(2)} processed via ${paymentMethod}`,
    };

    this.mediator.notify(this.getName(), 'payment.processed', result);

    return result;
  }

  refundPayment(transactionId: string): {
    success: boolean;
    message: string;
  } {
    return {
      success: true,
      message: `Refund processed for transaction ${transactionId}`,
    };
  }
}
