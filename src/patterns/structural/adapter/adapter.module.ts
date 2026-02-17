import { Module } from '@nestjs/common';
import { AdapterController } from './adapter.controller.js';
import { StripeApi } from './stripe-api.js';
import { PayPalApi } from './paypal-api.js';
import { StripeAdapter } from './stripe.adapter.js';
import { PayPalAdapter } from './paypal.adapter.js';

@Module({
  controllers: [AdapterController],
  providers: [StripeApi, PayPalApi, StripeAdapter, PayPalAdapter],
  exports: [StripeAdapter, PayPalAdapter],
})
export class AdapterModule {}
