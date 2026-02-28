export interface DiscountContext {
  totalAmount: number;
  itemCount: number;
  customerType: string;
}

export interface Expression {
  interpret(context: DiscountContext): number;
}
