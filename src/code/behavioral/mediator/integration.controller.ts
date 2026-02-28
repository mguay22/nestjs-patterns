import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './integration.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  placeOrder(
    @Body()
    body: {
      items: { name: string; qty: number; price: number }[];
      paymentMethod: string;
      shippingAddress: Record<string, string>;
      customerEmail: string;
    },
  ) {
    return this.orderService.placeOrder(body);
  }
}
