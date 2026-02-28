import { Controller, Post, Body } from '@nestjs/common';
import { OrderCreationService } from './integration.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderCreation: OrderCreationService) {}

  @Post()
  createOrder(
    @Body()
    body: {
      items: { name: string; price: number; quantity: number }[];
      customerEmail: string;
    },
  ) {
    return this.orderCreation.createOrder(body);
  }
}
