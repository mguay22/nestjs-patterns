import { Injectable } from '@nestjs/common';
import { DiscountParserService } from './discount-parser.service';

@Injectable()
export class DiscountService {
  constructor(private readonly parser: DiscountParserService) {}

  evaluate(body: {
    rule: string;
    originalPrice: number;
    itemCount: number;
    customerType: string;
  }) {
    const expression = this.parser.parse(body.rule);
    return expression.interpret({
      originalPrice: body.originalPrice,
      itemCount: body.itemCount,
      customerType: body.customerType,
    });
  }
}
