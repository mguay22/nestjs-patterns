import { Module } from '@nestjs/common';
import { IteratorController } from './iterator.controller';

@Module({
  controllers: [IteratorController],
})
export class IteratorModule {}
