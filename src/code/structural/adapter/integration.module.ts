import { Module } from '@nestjs/common';
import { PaymentController } from './integration.controller';
import { PaymentGatewayService } from './integration.service';
import { StripeApi } from './stripe-api';
import { PayPalApi } from './paypal-api';
import { StripeAdapter } from './stripe.adapter';
import { PayPalAdapter } from './paypal.adapter';

@Module({
  controllers: [PaymentController],
  providers: [PaymentGatewayService, StripeApi, PayPalApi, StripeAdapter, PayPalAdapter],
  exports: [StripeAdapter, PayPalAdapter],
})
export class AdapterModule {}
