import { Module } from '@nestjs/common';
import { PaymentController } from './integration.controller';
import { PaymentService } from './integration.service';
import { StripeFactory } from './stripe.factory';
import { PaypalFactory } from './paypal.factory';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, StripeFactory, PaypalFactory],
  exports: [StripeFactory, PaypalFactory],
})
export class AbstractFactoryModule {}
