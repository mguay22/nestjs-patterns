import { Injectable } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Injectable()
export class PricingCalculationService {
  constructor(private readonly pricingService: PricingService) {}

  getStrategies() {
    return this.pricingService.getAvailableStrategies();
  }

  calculate(basePrice: number, quantity: number, strategy?: string) {
    return this.pricingService.calculatePrice(basePrice, quantity, strategy);
  }
}
