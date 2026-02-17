import { Body, Controller, Post } from '@nestjs/common';
import { OrderFacadeService } from './order-facade.service.js';
import type { PlaceOrderData } from './order-facade.service.js';

@Controller('facade')
export class FacadeController {
  constructor(private readonly orderFacade: OrderFacadeService) {}

  @Post('place-order')
  placeOrder(@Body() dto: PlaceOrderData) {
    return this.orderFacade.placeOrder(dto);
  }
}
