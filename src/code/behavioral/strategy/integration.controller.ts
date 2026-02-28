import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PricingCalculationService } from './integration.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingCalculation: PricingCalculationService) {}

  @Get('strategies')
  getStrategies() {
    return this.pricingCalculation.getStrategies();
  }

  @Post('calculate')
  calculate(
    @Body() body: { basePrice: number; quantity: number },
    @Query('strategy') strategy?: string,
  ) {
    return this.pricingCalculation.calculate(
      body.basePrice,
      body.quantity,
      strategy,
    );
  }
}
