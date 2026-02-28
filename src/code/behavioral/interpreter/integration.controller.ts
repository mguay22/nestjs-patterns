import { Controller, Post, Body } from '@nestjs/common';
import { DiscountService } from './integration.service';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post('evaluate')
  evaluate(
    @Body()
    body: {
      rule: string;
      originalPrice: number;
      itemCount: number;
      customerType: string;
    },
  ) {
    return this.discountService.evaluate(body);
  }
}
