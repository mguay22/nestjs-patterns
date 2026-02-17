import { Module } from '@nestjs/common';
import { MementoController } from './memento.controller';
import { CartHistoryService } from './cart-history.service';

@Module({
  controllers: [MementoController],
  providers: [CartHistoryService],
  exports: [CartHistoryService],
})
export class MementoModule {}
