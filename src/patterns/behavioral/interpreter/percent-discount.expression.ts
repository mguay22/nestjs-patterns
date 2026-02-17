import { Expression, DiscountContext } from './expression.interface';

export class PercentDiscountExpression implements Expression {
  constructor(private readonly percentage: number) {}

  interpret(context: DiscountContext): number {
    return context.totalAmount * this.percentage / 100;
  }
}
