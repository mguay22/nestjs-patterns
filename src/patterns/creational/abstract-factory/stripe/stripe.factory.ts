import { Injectable } from '@nestjs/common';
import { PaymentFactory } from '../payment-factory.interface';
import { StripePaymentProcessor } from './stripe-payment-processor';
import { StripeRefundHandler } from './stripe-refund-handler';

@Injectable()
export class StripeFactory implements PaymentFactory {
  createPaymentProcessor() {
    return new StripePaymentProcessor();
  }

  createRefundHandler() {
    return new StripeRefundHandler();
  }
}
