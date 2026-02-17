import { Injectable } from '@nestjs/common';
import { PaymentFactory } from '../payment-factory.interface.js';
import { StripePaymentProcessor } from './stripe-payment-processor.js';
import { StripeRefundHandler } from './stripe-refund-handler.js';

@Injectable()
export class StripeFactory implements PaymentFactory {
  createPaymentProcessor() {
    return new StripePaymentProcessor();
  }

  createRefundHandler() {
    return new StripeRefundHandler();
  }
}
