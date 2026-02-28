import { Module } from '@nestjs/common';
import { OrderController } from './integration.controller';
import { OrderService } from './integration.service';
import { OrderCommandInvokerService } from './order-command-invoker.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderCommandInvokerService],
  exports: [OrderCommandInvokerService],
})
export class CommandModule {}
