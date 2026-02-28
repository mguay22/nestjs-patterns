import { Injectable } from '@nestjs/common';
import { StripeFactory } from './stripe.factory';
import { PaypalFactory } from './paypal.factory';
import type { PaymentFactory } from './payment-factory.interface';

@Injectable()
export class PaymentService {
  private readonly factories: Record<string, PaymentFactory>;

  constructor(stripeFactory: StripeFactory, paypalFactory: PaypalFactory) {
    this.factories = {
      stripe: stripeFactory,
      paypal: paypalFactory,
    };
  }

  processPayment(gateway: string) {
    const factory = this.factories[gateway];
    const processor = factory.createPaymentProcessor();
    return processor.processPayment(99.99);
  }

  processRefund(gateway: string) {
    const factory = this.factories[gateway];
    const refundHandler = factory.createRefundHandler();
    return refundHandler.processRefund('TXN-123', 49.99);
  }
}
