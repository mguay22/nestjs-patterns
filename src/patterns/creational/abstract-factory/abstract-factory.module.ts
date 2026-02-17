import { Module } from '@nestjs/common';
import { AbstractFactoryController } from './abstract-factory.controller.js';
import { StripeFactory } from './stripe/stripe.factory.js';
import { PaypalFactory } from './paypal/paypal.factory.js';

@Module({
  controllers: [AbstractFactoryController],
  providers: [StripeFactory, PaypalFactory],
  exports: [StripeFactory, PaypalFactory],
})
export class AbstractFactoryModule {}
