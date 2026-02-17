import { Injectable } from '@nestjs/common';
import { PricingStrategy, PricingResult } from './pricing-strategy.interface';

@Injectable()
export class BogoStrategy implements PricingStrategy {
  readonly name = 'bogo';

  calculate(basePrice: number, quantity: number): PricingResult {
    const freeItems = Math.floor(quantity / 2);
    const paidItems = quantity - freeItems;
    const finalPrice = basePrice * paidItems;
    const discount = basePrice * freeItems;

    return {
      finalPrice: Math.round(finalPrice * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      strategy: `Buy one get one free (${freeItems} free item${freeItems !== 1 ? 's' : ''})`,
    };
  }
}
