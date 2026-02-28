import { Controller, Post, Body } from '@nestjs/common';
import { OrderAnalysisService } from './integration.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderAnalysis: OrderAnalysisService) {}

  @Post('analyze')
  analyzeOrder(
    @Body()
    body: {
      items: { type: string; name: string; price: number; quantity: number }[];
    },
  ) {
    return this.orderAnalysis.analyzeOrder(body.items);
  }
}
