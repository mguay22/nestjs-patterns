import { Injectable } from '@nestjs/common';

@Injectable()
export class PayPalApi {
  makePayment(
    total: string,
    currencyCode: string,
  ): { paymentId: string; state: string } {
    return {
      paymentId: `paypal_${Date.now()}`,
      state: 'approved',
    };
  }
}
