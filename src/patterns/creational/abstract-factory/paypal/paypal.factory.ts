import { Injectable } from '@nestjs/common';
import { PaymentFactory } from '../payment-factory.interface.js';
import { PaypalPaymentProcessor } from './paypal-payment-processor.js';
import { PaypalRefundHandler } from './paypal-refund-handler.js';

@Injectable()
export class PaypalFactory implements PaymentFactory {
  createPaymentProcessor() {
    return new PaypalPaymentProcessor();
  }

  createRefundHandler() {
    return new PaypalRefundHandler();
  }
}
