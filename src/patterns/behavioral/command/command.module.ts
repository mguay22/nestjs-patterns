import { Module } from '@nestjs/common';
import { CommandController } from './command.controller';
import { OrderCommandInvokerService } from './order-command-invoker.service';

@Module({
  controllers: [CommandController],
  providers: [OrderCommandInvokerService],
  exports: [OrderCommandInvokerService],
})
export class CommandModule {}
