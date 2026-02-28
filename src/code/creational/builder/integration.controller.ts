import { Controller, Post, Body } from '@nestjs/common';
import { OrderBuildingService } from './integration.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderBuilding: OrderBuildingService) {}

  @Post()
  createOrder(
    @Body()
    body: {
      type?: 'express' | 'gift';
      items: { name: string; price: number; quantity: number }[];
      recipientAddress?: string;
    },
  ) {
    return this.orderBuilding.createOrder(body);
  }
}
