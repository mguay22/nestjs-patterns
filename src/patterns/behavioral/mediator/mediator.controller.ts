import { Controller, Post, Body } from '@nestjs/common';
import { OrderMediatorService } from './order-mediator.service';

@Controller('mediator')
export class MediatorController {
  constructor(private readonly orderMediator: OrderMediatorService) {}

  @Post('orders')
  placeOrder(
    @Body()
    body: {
      items: { name: string; qty: number; price: number }[];
      paymentMethod: string;
      shippingAddress: Record<string, string>;
      customerEmail: string;
    },
  ) {
    return this.orderMediator.placeOrder(body);
  }
}
