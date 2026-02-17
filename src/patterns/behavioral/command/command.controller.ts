import { Controller, Post, Get, Param, Body, BadRequestException } from '@nestjs/common';
import { OrderCommandInvokerService } from './order-command-invoker.service';
import { PlaceOrderCommand } from './place-order.command';
import { CancelOrderCommand } from './cancel-order.command';
import { RefundOrderCommand } from './refund-order.command';

@Controller('command')
export class CommandController {
  constructor(private readonly invoker: OrderCommandInvokerService) {}

  @Post('orders/undo')
  undoLastCommand() {
    const result = this.invoker.undoLastCommand();
    return { result };
  }

  @Post('orders/:action')
  executeAction(
    @Param('action') action: string,
    @Body() body: { orderId: string; amount?: number; reason?: string },
  ) {
    let command;

    switch (action) {
      case 'place':
        command = new PlaceOrderCommand(body.orderId, body.amount ?? 0);
        break;
      case 'cancel':
        command = new CancelOrderCommand(body.orderId, body.reason);
        break;
      case 'refund':
        command = new RefundOrderCommand(body.orderId, body.amount, body.reason);
        break;
      default:
        throw new BadRequestException(
          `Unknown action "${action}". Valid actions: place, cancel, refund`,
        );
    }

    const result = this.invoker.executeCommand(command);
    return { action, result };
  }

  @Get('orders/history')
  getHistory() {
    return { history: this.invoker.getHistory() };
  }
}
