import { Controller, Post, Body } from '@nestjs/common';
import { OrderPlacementService } from './integration.service';
import type { PlaceOrderData } from './order-facade.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderPlacement: OrderPlacementService) {}

  @Post()
  placeOrder(@Body() orderData: PlaceOrderData) {
    return this.orderPlacement.placeOrder(orderData);
  }
}
