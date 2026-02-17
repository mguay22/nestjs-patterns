import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { OrderProcessor, OrderItem } from './order-processor.interface.js';
import { BaseOrderProcessor } from './base-order-processor.js';
import { LoggingDecorator } from './logging.decorator.js';
import { ValidationDecorator } from './validation.decorator.js';
import { DiscountDecorator } from './discount.decorator.js';
import { TrackExecution } from './track-execution.decorator.js';

interface ProcessOrderDto {
  items: OrderItem[];
  decorators: ('logging' | 'validation' | 'discount')[];
}

@Controller('decorator')
export class DecoratorController {
  @Post('orders/process')
  @TrackExecution()
  processOrder(@Body() dto: ProcessOrderDto) {
    let processor: OrderProcessor = new BaseOrderProcessor();

    for (const decoratorName of dto.decorators) {
      switch (decoratorName) {
        case 'logging':
          processor = new LoggingDecorator(processor);
          break;
        case 'validation':
          processor = new ValidationDecorator(processor);
          break;
        case 'discount':
          processor = new DiscountDecorator(processor);
          break;
        default:
          throw new BadRequestException(
            `Unknown decorator: ${decoratorName}. Valid decorators: logging, validation, discount`,
          );
      }
    }

    return processor.process({ items: dto.items });
  }
}
