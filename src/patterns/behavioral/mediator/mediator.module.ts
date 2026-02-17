import { Module } from '@nestjs/common';
import { MediatorController } from './mediator.controller';
import { OrderMediatorService } from './order-mediator.service';

@Module({
  controllers: [MediatorController],
  providers: [OrderMediatorService],
  exports: [OrderMediatorService],
})
export class MediatorModule {}
