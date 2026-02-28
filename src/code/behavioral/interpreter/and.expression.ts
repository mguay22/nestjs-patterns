import { Expression, DiscountContext } from './expression.interface';

export class AndExpression implements Expression {
  constructor(
    private readonly left: Expression,
    private readonly right: Expression,
  ) {}

  interpret(context: DiscountContext): number {
    return this.left.interpret(context) + this.right.interpret(context);
  }
}
