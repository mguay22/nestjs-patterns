import { PricingStrategy, PricingResult } from './pricing-strategy.interface.js';

export class TieredPricingStrategy implements PricingStrategy {
  calculate(basePrice: number, quantity: number): PricingResult {
    let discountPercentage: number;
    let tierName: string;

    if (quantity > 50) {
      discountPercentage = 20;
      tierName = '50+ items (20% off)';
    } else if (quantity >= 11) {
      discountPercentage = 10;
      tierName = '11-50 items (10% off)';
    } else {
      discountPercentage = 0;
      tierName = '1-10 items (base price)';
    }

    const subtotal = basePrice * quantity;
    const discount = subtotal * discountPercentage / 100;
    const finalPrice = subtotal - discount;

    return {
      finalPrice: Math.round(finalPrice * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      strategy: `Tiered pricing: ${tierName}`,
    };
  }
}
