import { Module } from '@nestjs/common';
import { VisitorController } from './visitor.controller.js';

@Module({
  controllers: [VisitorController],
})
export class VisitorModule {}
