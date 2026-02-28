import { Controller, Post, Body, Query } from '@nestjs/common';
import { OrderProcessingService } from './integration.service';
import type { OrderData } from './order-processor.interface';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderProcessing: OrderProcessingService) {}

  @Post('process')
  processOrder(
    @Body() order: OrderData,
    @Query('discount') discount?: string,
  ) {
    return this.orderProcessing.processOrder(order, discount);
  }
}
