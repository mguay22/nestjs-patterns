import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PricingService } from './pricing.service.js';
import { PercentageDiscountStrategy } from './percentage-discount.strategy.js';
import { FlatDiscountStrategy } from './flat-discount.strategy.js';
import { BogoStrategy } from './bogo.strategy.js';
import { TieredPricingStrategy } from './tiered-pricing.strategy.js';

@Controller('strategy')
export class StrategyController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('pricing')
  calculatePrice(
    @Body()
    body: {
      strategy: string;
      basePrice: number;
      quantity: number;
      discountValue?: number;
    },
  ) {
    switch (body.strategy) {
      case 'percentage':
        if (body.discountValue === undefined) {
          throw new BadRequestException('discountValue is required for percentage strategy');
        }
        this.pricingService.setStrategy(new PercentageDiscountStrategy(body.discountValue));
        break;
      case 'flat':
        if (body.discountValue === undefined) {
          throw new BadRequestException('discountValue is required for flat strategy');
        }
        this.pricingService.setStrategy(new FlatDiscountStrategy(body.discountValue));
        break;
      case 'bogo':
        this.pricingService.setStrategy(new BogoStrategy());
        break;
      case 'tiered':
        this.pricingService.setStrategy(new TieredPricingStrategy());
        break;
      default:
        throw new BadRequestException(
          `Unknown strategy "${body.strategy}". Valid strategies: percentage, flat, bogo, tiered`,
        );
    }

    const result = this.pricingService.calculatePrice(body.basePrice, body.quantity);

    return {
      input: {
        strategy: body.strategy,
        basePrice: body.basePrice,
        quantity: body.quantity,
        discountValue: body.discountValue,
      },
      result,
    };
  }
}
