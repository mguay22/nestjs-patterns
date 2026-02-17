import { Injectable } from '@nestjs/common';
import { PricingStrategy, PricingResult } from './pricing-strategy.interface';

@Injectable()
export class PercentageDiscountStrategy implements PricingStrategy {
  readonly name = 'percentage';

  constructor(private readonly percentage: number) {}

  calculate(basePrice: number, quantity: number): PricingResult {
    const subtotal = basePrice * quantity;
    const discount = subtotal * this.percentage / 100;
    const finalPrice = subtotal - discount;

    return {
      finalPrice: Math.round(finalPrice * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      strategy: `${this.percentage}% discount`,
    };
  }
}
