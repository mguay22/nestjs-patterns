import { Module } from '@nestjs/common';
import { CartController } from './integration.controller';
import { CartService } from './integration.service';
import { CartHistoryService } from './cart-history.service';

@Module({
  controllers: [CartController],
  providers: [CartService, CartHistoryService],
  exports: [CartHistoryService],
})
export class MementoModule {}
