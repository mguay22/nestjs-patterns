import { Module } from '@nestjs/common';
import { IteratorController } from './iterator.controller.js';

@Module({
  controllers: [IteratorController],
})
export class IteratorModule {}
