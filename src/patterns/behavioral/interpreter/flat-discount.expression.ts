import { Expression, DiscountContext } from './expression.interface.js';

export class FlatDiscountExpression implements Expression {
  constructor(private readonly amount: number) {}

  interpret(_context: DiscountContext): number {
    return this.amount;
  }
}
