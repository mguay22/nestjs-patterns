export interface PricingResult {
  finalPrice: number;
  discount: number;
  strategy: string;
}

export interface PricingStrategy {
  readonly name: string;
  calculate(basePrice: number, quantity: number): PricingResult;
}

export const PRICING_STRATEGY = Symbol('PRICING_STRATEGY');
