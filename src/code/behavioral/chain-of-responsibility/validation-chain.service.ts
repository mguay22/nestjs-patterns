import { Injectable } from '@nestjs/common';
import { OrderValidator, OrderData, ValidationResult } from './order-validator.interface';
import { InventoryCheckHandler } from './inventory-check.handler';
import { PaymentValidationHandler } from './payment-validation.handler';
import { FraudDetectionHandler } from './fraud-detection.handler';
import { AddressValidationHandler } from './address-validation.handler';

@Injectable()
export class ValidationChainService {
  private readonly chain: OrderValidator;

  constructor() {
    const inventory = new InventoryCheckHandler();
    const payment = new PaymentValidationHandler();
    const fraud = new FraudDetectionHandler();
    const address = new AddressValidationHandler();

    inventory.setNext(payment).setNext(fraud).setNext(address);

    this.chain = inventory;
  }

  async validate(order: OrderData): Promise<{
    isValid: boolean;
    results: ValidationResult[];
    errors: string[];
  }> {
    const results = await this.chain.validate(order);
    const allErrors = results.flatMap((r) => r.errors);

    return {
      isValid: allErrors.length === 0,
      results,
      errors: allErrors,
    };
  }
}
