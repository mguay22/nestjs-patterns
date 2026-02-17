import { Module } from '@nestjs/common';
import { CommandController } from './command.controller.js';
import { OrderCommandInvokerService } from './order-command-invoker.service.js';

@Module({
  controllers: [CommandController],
  providers: [OrderCommandInvokerService],
  exports: [OrderCommandInvokerService],
})
export class CommandModule {}
