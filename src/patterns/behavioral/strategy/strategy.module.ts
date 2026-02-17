import { Module } from '@nestjs/common';
import { StrategyController } from './strategy.controller.js';
import { PricingService } from './pricing.service.js';

@Module({
  controllers: [StrategyController],
  providers: [PricingService],
  exports: [PricingService],
})
export class StrategyModule {}
