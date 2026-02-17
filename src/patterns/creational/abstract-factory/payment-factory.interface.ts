import { PaymentProcessor, RefundHandler } from './payment.interfaces.js';

export interface PaymentFactory {
  createPaymentProcessor(): PaymentProcessor;
  createRefundHandler(): RefundHandler;
}
