import { Module } from '@nestjs/common';
import { FlyweightController } from './flyweight.controller';
import { ProductTypeFactoryService } from './product-type-factory.service';

@Module({
  controllers: [FlyweightController],
  providers: [ProductTypeFactoryService],
  exports: [ProductTypeFactoryService],
})
export class FlyweightModule {}
