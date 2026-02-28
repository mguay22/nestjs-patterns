import { Controller, Post, Body } from '@nestjs/common';
import { OrderValidationService } from './integration.service';
import type { OrderData } from './order-validator.interface';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderValidation: OrderValidationService) {}

  @Post('validate')
  async validateOrder(@Body() order: OrderData) {
    return this.orderValidation.validate(order);
  }
}
