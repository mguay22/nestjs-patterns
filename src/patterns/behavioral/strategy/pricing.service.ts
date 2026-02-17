import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import type { PricingStrategy, PricingResult } from './pricing-strategy.interface';
import { PRICING_STRATEGY } from './pricing-strategy.interface';

@Injectable()
export class PricingService {
  private readonly strategies: Map<string, PricingStrategy>;

  constructor(
    @Inject(PRICING_STRATEGY)
    private readonly defaultStrategy: PricingStrategy,
    @Inject('ALL_PRICING_STRATEGIES')
    strategies: PricingStrategy[],
  ) {
    this.strategies = new Map(strategies.map((s) => [s.name, s]));
  }

  getDefaultStrategyName(): string {
    return this.defaultStrategy.name;
  }

  getAvailableStrategies(): string[] {
    return [...this.strategies.keys()];
  }

  calculatePrice(basePrice: number, quantity: number, strategyName?: string): PricingResult {
    const strategy = strategyName
      ? this.resolveStrategy(strategyName)
      : this.defaultStrategy;

    return strategy.calculate(basePrice, quantity);
  }

  private resolveStrategy(name: string): PricingStrategy {
    const strategy = this.strategies.get(name);
    if (!strategy) {
      throw new BadRequestException(
        `Unknown strategy "${name}". Available: ${this.getAvailableStrategies().join(', ')}`,
      );
    }
    return strategy;
  }
}
