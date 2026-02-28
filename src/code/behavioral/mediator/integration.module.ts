import { Module } from '@nestjs/common';
import { OrderController } from './integration.controller';
import { OrderService } from './integration.service';
import { OrderMediatorService } from './order-mediator.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderMediatorService],
  exports: [OrderMediatorService],
})
export class MediatorModule {}
