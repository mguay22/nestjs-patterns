import { Injectable } from '@nestjs/common';
import { PaymentGateway, PaymentResult } from './payment-gateway.interface';
import { PayPalApi } from './paypal-api';

@Injectable()
export class PayPalAdapter implements PaymentGateway {
  constructor(private readonly paypalApi: PayPalApi) {}

  charge(amount: number, currency: string): PaymentResult {
    const total = amount.toFixed(2);
    const result = this.paypalApi.makePayment(total, currency);

    return {
      success: result.state === 'approved',
      transactionId: result.paymentId,
      gateway: 'paypal',
    };
  }
}
