import { Module } from '@nestjs/common';
import { FactoryMethodController } from './factory-method.controller';
import { PhysicalProductCreator } from './physical-product.creator';
import { DigitalProductCreator } from './digital-product.creator';
import { SubscriptionProductCreator } from './subscription-product.creator';

@Module({
  controllers: [FactoryMethodController],
  providers: [
    PhysicalProductCreator,
    DigitalProductCreator,
    SubscriptionProductCreator,
  ],
  exports: [
    PhysicalProductCreator,
    DigitalProductCreator,
    SubscriptionProductCreator,
  ],
})
export class FactoryMethodModule {}
