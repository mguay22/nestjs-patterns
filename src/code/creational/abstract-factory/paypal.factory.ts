import { Injectable } from '@nestjs/common';
import { PaymentFactory } from '../payment-factory.interface';
import { PaypalPaymentProcessor } from './paypal-payment-processor';
import { PaypalRefundHandler } from './paypal-refund-handler';

@Injectable()
export class PaypalFactory implements PaymentFactory {
  createPaymentProcessor() {
    return new PaypalPaymentProcessor();
  }

  createRefundHandler() {
    return new PaypalRefundHandler();
  }
}
