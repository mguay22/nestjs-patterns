import {
  OrderProcessor,
  OrderData,
  ProcessedOrder,
} from './order-processor.interface';

export class DiscountDecorator implements OrderProcessor {
  constructor(
    private readonly wrapped: OrderProcessor,
    private readonly discountPercentage: number = 10,
  ) {}

  process(order: OrderData): ProcessedOrder {
    const result = this.wrapped.process(order);
    const discountAmount = result.total * (this.discountPercentage / 100);
    result.total = parseFloat((result.total - discountAmount).toFixed(2));
    result.steps.push(
      `Discount: ${this.discountPercentage}% discount applied (-$${discountAmount.toFixed(2)})`,
    );
    return result;
  }
}
