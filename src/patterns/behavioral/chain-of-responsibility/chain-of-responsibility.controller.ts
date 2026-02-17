import { Controller, Post, Body } from '@nestjs/common';
import { ValidationChainService } from './validation-chain.service';
import type { OrderData } from './order-validator.interface';

@Controller('chain')
export class ChainOfResponsibilityController {
  constructor(private readonly validationChainService: ValidationChainService) {}

  @Post('orders/validate')
  async validateOrder(@Body() order: OrderData) {
    const result = await this.validationChainService.validate(order);

    return {
      order,
      validation: result,
    };
  }
}
