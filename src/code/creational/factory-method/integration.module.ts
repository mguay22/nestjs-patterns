import { Module } from '@nestjs/common';
import { ProductController } from './integration.controller';
import { ProductCreationService } from './integration.service';
import { PhysicalProductCreator } from './physical-product.creator';
import { DigitalProductCreator } from './digital-product.creator';
import { SubscriptionProductCreator } from './subscription-product.creator';

@Module({
  controllers: [ProductController],
  providers: [
    ProductCreationService,
    PhysicalProductCreator,
    DigitalProductCreator,
    SubscriptionProductCreator,
  ],
  exports: [PhysicalProductCreator, DigitalProductCreator, SubscriptionProductCreator],
})
export class FactoryMethodModule {}
