import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StrategyController } from './strategy.controller';
import { PricingService } from './pricing.service';
import { PRICING_STRATEGY } from './pricing-strategy.interface';
import { PercentageDiscountStrategy } from './percentage-discount.strategy';
import { FlatDiscountStrategy } from './flat-discount.strategy';
import { BogoStrategy } from './bogo.strategy';
import { TieredPricingStrategy } from './tiered-pricing.strategy';

@Module({
  imports: [ConfigModule],
  controllers: [StrategyController],
  providers: [
    {
      provide: PercentageDiscountStrategy,
      useFactory: (config: ConfigService) => {
        const pct = config.get<number>('DISCOUNT_PERCENTAGE', 10);
        return new PercentageDiscountStrategy(pct);
      },
      inject: [ConfigService],
    },
    {
      provide: FlatDiscountStrategy,
      useFactory: (config: ConfigService) => {
        const amount = config.get<number>('DISCOUNT_FLAT_AMOUNT', 5);
        return new FlatDiscountStrategy(amount);
      },
      inject: [ConfigService],
    },
    BogoStrategy,
    TieredPricingStrategy,
    {
      provide: 'ALL_PRICING_STRATEGIES',
      useFactory: (
        percentage: PercentageDiscountStrategy,
        flat: FlatDiscountStrategy,
        bogo: BogoStrategy,
        tiered: TieredPricingStrategy,
      ) => [percentage, flat, bogo, tiered],
      inject: [PercentageDiscountStrategy, FlatDiscountStrategy, BogoStrategy, TieredPricingStrategy],
    },
    {
      provide: PRICING_STRATEGY,
      useFactory: (
        config: ConfigService,
        percentage: PercentageDiscountStrategy,
        flat: FlatDiscountStrategy,
        bogo: BogoStrategy,
        tiered: TieredPricingStrategy,
      ) => {
        const strategyName = config.get<string>('PRICING_STRATEGY', 'percentage');
        const map: Record<string, any> = { percentage, flat, bogo, tiered };
        return map[strategyName] ?? percentage;
      },
      inject: [
        ConfigService,
        PercentageDiscountStrategy,
        FlatDiscountStrategy,
        BogoStrategy,
        TieredPricingStrategy,
      ],
    },
    PricingService,
  ],
  exports: [PricingService],
})
export class StrategyModule {}
