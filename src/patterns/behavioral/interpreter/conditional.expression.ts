import { Expression, DiscountContext } from './expression.interface.js';

export type ConditionType = 'TOTAL_ABOVE' | 'ITEMS_ABOVE' | 'CUSTOMER_IS';

export class ConditionalExpression implements Expression {
  constructor(
    private readonly conditionType: ConditionType,
    private readonly conditionValue: string | number,
    private readonly innerExpression: Expression,
  ) {}

  interpret(context: DiscountContext): number {
    const conditionMet = this.evaluateCondition(context);
    return conditionMet ? this.innerExpression.interpret(context) : 0;
  }

  private evaluateCondition(context: DiscountContext): boolean {
    switch (this.conditionType) {
      case 'TOTAL_ABOVE':
        return context.totalAmount > Number(this.conditionValue);
      case 'ITEMS_ABOVE':
        return context.itemCount > Number(this.conditionValue);
      case 'CUSTOMER_IS':
        return context.customerType.toLowerCase() === String(this.conditionValue).toLowerCase();
      default:
        return false;
    }
  }
}
