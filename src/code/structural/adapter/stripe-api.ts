import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeApi {
  createCharge(
    amountInCents: number,
    cur: string,
  ): { id: string; status: string; amount: number } {
    return {
      id: `stripe_ch_${Date.now()}`,
      status: 'succeeded',
      amount: amountInCents,
    };
  }
}
