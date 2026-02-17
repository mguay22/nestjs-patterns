export interface PricingResult {
  finalPrice: number;
  discount: number;
  strategy: string;
}

export interface PricingStrategy {
  calculate(basePrice: number, quantity: number): PricingResult;
}
