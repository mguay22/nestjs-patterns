import { Module } from '@nestjs/common';
import type { PricingStrategy } from './pricing-strategy.interface';
import { PRICING_STRATEGY } from './pricing-strategy.interface';
import { PricingController } from './integration.controller';
import { PricingCalculationService } from './integration.service';
import { PricingService } from './pricing.service';
import { PercentageDiscountStrategy } from './percentage-discount.strategy';
import { FlatDiscountStrategy } from './flat-discount.strategy';
import { BogoStrategy } from './bogo.strategy';
import { TieredPricingStrategy } from './tiered-pricing.strategy';

@Module({
  controllers: [PricingController],
  providers: [
    PercentageDiscountStrategy,
    FlatDiscountStrategy,
    BogoStrategy,
    TieredPricingStrategy,
    {
      provide: PRICING_STRATEGY,
      useExisting: PercentageDiscountStrategy,
    },
    {
      provide: 'ALL_PRICING_STRATEGIES',
      useFactory: (...strategies: PricingStrategy[]) => strategies,
      inject: [
        PercentageDiscountStrategy,
        FlatDiscountStrategy,
        BogoStrategy,
        TieredPricingStrategy,
      ],
    },
    PricingCalculationService,
    PricingService,
  ],
  exports: [PricingService],
})
export class StrategyModule {}
