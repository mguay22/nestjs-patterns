import { Module } from '@nestjs/common';
import { StrategyController } from './strategy.controller';
import { PricingService } from './pricing.service';

@Module({
  controllers: [StrategyController],
  providers: [PricingService],
  exports: [PricingService],
})
export class StrategyModule {}
