import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { OrderStateService } from './integration.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderState: OrderStateService) {}

  @Post()
  createOrder() {
    return this.orderState.createOrder();
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderState.getOrder(id);
  }

  @Post(':id/transition')
  transition(@Param('id') id: string, @Body('action') action: string) {
    return this.orderState.transition(id, action);
  }
}
