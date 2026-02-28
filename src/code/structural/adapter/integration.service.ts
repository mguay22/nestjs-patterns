import { Injectable } from '@nestjs/common';
import { StripeAdapter } from './stripe.adapter';
import { PayPalAdapter } from './paypal.adapter';

@Injectable()
export class PaymentGatewayService {
  constructor(
    private readonly stripeAdapter: StripeAdapter,
    private readonly paypalAdapter: PayPalAdapter,
  ) {}

  charge(gateway: string, amount: number) {
    const adapter =
      gateway === 'paypal' ? this.paypalAdapter : this.stripeAdapter;
    return adapter.charge(amount, 'USD');
  }
}
