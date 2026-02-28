import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrderService } from './integration.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  placeOrder(@Body() body: { orderId: string; amount: number }) {
    return this.orderService.placeOrder(body.orderId, body.amount);
  }

  @Post('cancel')
  cancelOrder(@Body() body: { orderId: string; reason: string }) {
    return this.orderService.cancelOrder(body.orderId, body.reason);
  }

  @Post('undo')
  undo() {
    return this.orderService.undo();
  }

  @Get('history')
  getHistory() {
    return this.orderService.getHistory();
  }
}
