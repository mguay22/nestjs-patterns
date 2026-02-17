import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service.js';

@Controller('observer')
export class ObserverController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders')
  createOrder(
    @Body()
    body: {
      items: { name: string; price: number; quantity: number }[];
      customerEmail: string;
    },
  ) {
    const result = this.orderService.createOrder(body);

    return {
      orderId: result.orderId,
      totalAmount: result.totalAmount,
      timestamp: result.timestamp,
      message: 'Order created, observers notified',
    };
  }
}
