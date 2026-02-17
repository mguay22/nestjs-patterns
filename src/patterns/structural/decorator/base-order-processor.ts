import {
  OrderProcessor,
  OrderData,
  ProcessedOrder,
} from './order-processor.interface.js';

export class BaseOrderProcessor implements OrderProcessor {
  process(order: OrderData): ProcessedOrder {
    const total = order.items.reduce((sum, item) => sum + item.price, 0);

    return {
      orderId: `ORD-${Date.now()}`,
      steps: ['Base processing: order created'],
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date().toISOString(),
    };
  }
}
