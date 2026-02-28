import { Injectable } from '@nestjs/common';
import { OrderCommandInvokerService } from './order-command-invoker.service';
import { PlaceOrderCommand } from './place-order.command';
import { CancelOrderCommand } from './cancel-order.command';

@Injectable()
export class OrderService {
  constructor(private readonly invoker: OrderCommandInvokerService) {}

  placeOrder(orderId: string, amount: number) {
    return this.invoker.executeCommand(
      new PlaceOrderCommand(orderId, amount),
    );
  }

  cancelOrder(orderId: string, reason: string) {
    return this.invoker.executeCommand(
      new CancelOrderCommand(orderId, reason),
    );
  }

  undo() {
    return this.invoker.undoLastCommand();
  }

  getHistory() {
    return this.invoker.getHistory();
  }
}
