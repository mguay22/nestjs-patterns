import { Module } from '@nestjs/common';
import { VisitorController } from './visitor.controller';

@Module({
  controllers: [VisitorController],
})
export class VisitorModule {}
