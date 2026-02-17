import { Module } from '@nestjs/common';
import { DecoratorController } from './decorator.controller.js';

@Module({
  controllers: [DecoratorController],
})
export class DecoratorModule {}
