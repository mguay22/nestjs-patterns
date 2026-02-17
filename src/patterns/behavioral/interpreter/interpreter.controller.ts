import { Controller, Post, Body } from '@nestjs/common';
import { DiscountParserService } from './discount-parser.service';
import { DiscountContext } from './expression.interface';

@Controller('interpreter')
export class InterpreterController {
  constructor(private readonly discountParser: DiscountParserService) {}

  @Post('discounts/evaluate')
  evaluateDiscount(
    @Body() body: { rule: string; context: DiscountContext },
  ) {
    const expression = this.discountParser.parse(body.rule);
    const discountAmount = expression.interpret(body.context);

    return {
      rule: body.rule,
      context: body.context,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalPrice: Math.round((body.context.totalAmount - discountAmount) * 100) / 100,
    };
  }
}
