import { Module } from '@nestjs/common';
import { BuilderController } from './builder.controller';
import { OrderBuilder } from './order-builder';

@Module({
  controllers: [BuilderController],
  providers: [OrderBuilder],
  exports: [OrderBuilder],
})
export class BuilderModule {}
