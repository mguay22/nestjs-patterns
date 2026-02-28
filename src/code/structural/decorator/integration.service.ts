import { Injectable } from '@nestjs/common';
import type { OrderData, OrderProcessor } from './order-processor.interface';
import { BaseOrderProcessor } from './base-order-processor';
import { ValidationDecorator } from './validation.decorator';
import { LoggingDecorator } from './logging.decorator';
import { DiscountDecorator } from './discount.decorator';
import { TrackExecution } from './track-execution.decorator';

@Injectable()
export class OrderProcessingService {
  @TrackExecution()
  processOrder(order: OrderData, discount?: string) {
    let processor: OrderProcessor = new BaseOrderProcessor();
    processor = new ValidationDecorator(processor);
    processor = new LoggingDecorator(processor);

    if (discount) {
      processor = new DiscountDecorator(processor, parseFloat(discount));
    }

    return processor.process(order);
  }
}
