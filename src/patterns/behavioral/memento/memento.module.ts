import { Module } from '@nestjs/common';
import { MementoController } from './memento.controller.js';
import { CartHistoryService } from './cart-history.service.js';

@Module({
  controllers: [MementoController],
  providers: [CartHistoryService],
  exports: [CartHistoryService],
})
export class MementoModule {}
