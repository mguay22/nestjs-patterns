import { Controller, Post, Get, Body } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Controller('strategy')
export class StrategyController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('pricing')
  getInfo() {
    return {
      defaultStrategy: this.pricingService.getDefaultStrategyName(),
      availableStrategies: this.pricingService.getAvailableStrategies(),
      note: 'Default strategy is configured via PRICING_STRATEGY env var at app start.',
    };
  }

  @Post('pricing')
  calculatePrice(
    @Body()
    body: {
      strategy?: string;
      basePrice: number;
      quantity: number;
    },
  ) {
    const result = this.pricingService.calculatePrice(
      body.basePrice,
      body.quantity,
      body.strategy,
    );

    return {
      input: {
        strategy: body.strategy ?? this.pricingService.getDefaultStrategyName(),
        basePrice: body.basePrice,
        quantity: body.quantity,
      },
      result,
    };
  }
}
