import { Module } from '@nestjs/common';
import { AbstractFactoryController } from './abstract-factory.controller';
import { StripeFactory } from './stripe/stripe.factory';
import { PaypalFactory } from './paypal/paypal.factory';

@Module({
  controllers: [AbstractFactoryController],
  providers: [StripeFactory, PaypalFactory],
  exports: [StripeFactory, PaypalFactory],
})
export class AbstractFactoryModule {}
