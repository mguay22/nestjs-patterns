import { randomUUID } from 'node:crypto';
import { RefundHandler } from '../payment.interfaces';

export class PaypalRefundHandler implements RefundHandler {
  processRefund(transactionId: string, amount: number) {
    return {
      success: true,
      refundId: `paypal_ref_${randomUUID()}`,
      provider: 'paypal',
      originalTransactionId: transactionId,
      amount,
      estimatedArrival: '3-5 business days',
    };
  }
}
