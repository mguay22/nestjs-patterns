import { BadRequestException } from '@nestjs/common';
import {
  OrderProcessor,
  OrderData,
  ProcessedOrder,
} from './order-processor.interface';

export class ValidationDecorator implements OrderProcessor {
  constructor(private readonly wrapped: OrderProcessor) {}

  process(order: OrderData): ProcessedOrder {
    if (!order.items || order.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    for (const item of order.items) {
      if (item.price <= 0) {
        throw new BadRequestException(
          `Item "${item.name}" has an invalid price: ${item.price}. Price must be greater than 0`,
        );
      }
    }

    const result = this.wrapped.process(order);
    result.steps.push('Validation: all items validated successfully');
    return result;
  }
}
