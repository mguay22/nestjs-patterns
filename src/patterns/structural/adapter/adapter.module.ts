import { Module } from '@nestjs/common';
import { AdapterController } from './adapter.controller';
import { StripeApi } from './stripe-api';
import { PayPalApi } from './paypal-api';
import { StripeAdapter } from './stripe.adapter';
import { PayPalAdapter } from './paypal.adapter';

@Module({
  controllers: [AdapterController],
  providers: [StripeApi, PayPalApi, StripeAdapter, PayPalAdapter],
  exports: [StripeAdapter, PayPalAdapter],
})
export class AdapterModule {}
