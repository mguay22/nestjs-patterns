import { Injectable } from '@nestjs/common';
import { PricingStrategy, PricingResult } from './pricing-strategy.interface.js';

@Injectable()
export class PricingService {
  private strategy: PricingStrategy | null = null;

  setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy;
  }

  calculatePrice(basePrice: number, quantity: number): PricingResult {
    if (!this.strategy) {
      const subtotal = basePrice * quantity;
      return {
        finalPrice: Math.round(subtotal * 100) / 100,
        discount: 0,
        strategy: 'No strategy applied (full price)',
      };
    }

    return this.strategy.calculate(basePrice, quantity);
  }
}
