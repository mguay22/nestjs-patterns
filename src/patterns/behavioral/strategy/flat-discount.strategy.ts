import { Injectable } from '@nestjs/common';
import { PricingStrategy, PricingResult } from './pricing-strategy.interface';

@Injectable()
export class FlatDiscountStrategy implements PricingStrategy {
  readonly name = 'flat';

  constructor(private readonly flatAmount: number) {}

  calculate(basePrice: number, quantity: number): PricingResult {
    const subtotal = basePrice * quantity;
    const discount = Math.min(this.flatAmount, subtotal);
    const finalPrice = subtotal - discount;

    return {
      finalPrice: Math.round(finalPrice * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      strategy: `$${this.flatAmount} flat discount`,
    };
  }
}
