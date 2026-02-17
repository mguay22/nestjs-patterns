import { Module } from '@nestjs/common';
import { FlyweightController } from './flyweight.controller.js';
import { ProductTypeFactoryService } from './product-type-factory.service.js';

@Module({
  controllers: [FlyweightController],
  providers: [ProductTypeFactoryService],
  exports: [ProductTypeFactoryService],
})
export class FlyweightModule {}
