import { randomUUID } from 'node:crypto';
import { PaymentProcessor } from '../payment.interfaces';

export class PaypalPaymentProcessor implements PaymentProcessor {
  processPayment(amount: number) {
    return {
      success: true,
      transactionId: `paypal_txn_${randomUUID()}`,
      provider: 'paypal',
      amount,
      currency: 'USD',
      processingFee: +(amount * 0.0349 + 0.49).toFixed(2),
    };
  }
}
