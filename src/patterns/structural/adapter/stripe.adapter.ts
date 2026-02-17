import { Injectable } from '@nestjs/common';
import { PaymentGateway, PaymentResult } from './payment-gateway.interface.js';
import { StripeApi } from './stripe-api.js';

@Injectable()
export class StripeAdapter implements PaymentGateway {
  constructor(private readonly stripeApi: StripeApi) {}

  charge(amount: number, currency: string): PaymentResult {
    const amountInCents = Math.round(amount * 100);
    const result = this.stripeApi.createCharge(amountInCents, currency);

    return {
      success: result.status === 'succeeded',
      transactionId: result.id,
      gateway: 'stripe',
    };
  }
}
