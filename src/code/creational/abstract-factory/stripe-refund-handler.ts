import { randomUUID } from 'node:crypto';
import { RefundHandler } from '../payment.interfaces';

export class StripeRefundHandler implements RefundHandler {
  processRefund(transactionId: string, amount: number) {
    return {
      success: true,
      refundId: `stripe_ref_${randomUUID()}`,
      provider: 'stripe',
      originalTransactionId: transactionId,
      amount,
      estimatedArrival: '5-10 business days',
    };
  }
}
