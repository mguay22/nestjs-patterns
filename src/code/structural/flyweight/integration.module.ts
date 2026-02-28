import { Module } from '@nestjs/common';
import { ProductController } from './integration.controller';
import { ProductVariantService } from './integration.service';
import { ProductTypeFactoryService } from './product-type-factory.service';

@Module({
  controllers: [ProductController],
  providers: [ProductVariantService, ProductTypeFactoryService],
  exports: [ProductTypeFactoryService],
})
export class FlyweightModule {}
