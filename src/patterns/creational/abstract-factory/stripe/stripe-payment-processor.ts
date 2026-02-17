import { randomUUID } from 'node:crypto';
import { PaymentProcessor } from '../payment.interfaces';

export class StripePaymentProcessor implements PaymentProcessor {
  processPayment(amount: number) {
    return {
      success: true,
      transactionId: `stripe_txn_${randomUUID()}`,
      provider: 'stripe',
      amount,
      currency: 'USD',
      processingFee: +(amount * 0.029 + 0.3).toFixed(2),
    };
  }
}
