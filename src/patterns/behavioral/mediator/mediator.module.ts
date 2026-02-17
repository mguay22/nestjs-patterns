import { Module } from '@nestjs/common';
import { MediatorController } from './mediator.controller.js';
import { OrderMediatorService } from './order-mediator.service.js';

@Module({
  controllers: [MediatorController],
  providers: [OrderMediatorService],
  exports: [OrderMediatorService],
})
export class MediatorModule {}
