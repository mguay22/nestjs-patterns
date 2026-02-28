import { Module } from '@nestjs/common';
import { OrderController } from './integration.controller';
import { OrderProcessingService } from './integration.service';

@Module({
  controllers: [OrderController],
  providers: [OrderProcessingService],
})
export class DecoratorModule {}
