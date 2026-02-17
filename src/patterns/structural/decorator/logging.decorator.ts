import {
  OrderProcessor,
  OrderData,
  ProcessedOrder,
} from './order-processor.interface';

export class LoggingDecorator implements OrderProcessor {
  constructor(private readonly wrapped: OrderProcessor) {}

  process(order: OrderData): ProcessedOrder {
    console.log(`[LoggingDecorator] Processing order with ${order.items.length} items`);
    const result = this.wrapped.process(order);
    result.steps.push('Logging: order processing logged');
    console.log(`[LoggingDecorator] Order ${result.orderId} processed, total: $${result.total}`);
    return result;
  }
}
