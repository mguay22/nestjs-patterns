import { PaymentProcessor, RefundHandler } from './payment.interfaces';

export interface PaymentFactory {
  createPaymentProcessor(): PaymentProcessor;
  createRefundHandler(): RefundHandler;
}
