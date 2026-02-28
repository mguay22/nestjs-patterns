import { Module } from '@nestjs/common';
import { OrderController } from './integration.controller';
import { OrderAnalysisService } from './integration.service';

@Module({
  controllers: [OrderController],
  providers: [OrderAnalysisService],
})
export class VisitorModule {}
