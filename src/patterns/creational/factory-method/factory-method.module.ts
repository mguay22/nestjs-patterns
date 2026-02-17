import { Module } from '@nestjs/common';
import { FactoryMethodController } from './factory-method.controller.js';
import { PhysicalProductCreator } from './physical-product.creator.js';
import { DigitalProductCreator } from './digital-product.creator.js';
import { SubscriptionProductCreator } from './subscription-product.creator.js';

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
