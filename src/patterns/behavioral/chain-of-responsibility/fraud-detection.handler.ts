import { OrderValidator, OrderData, ValidationResult } from './order-validator.interface.js';

export class FraudDetectionHandler extends OrderValidator {
  private readonly suspiciousCountries = ['XX', 'YY', 'ZZ'];
  private readonly highValueThreshold = 10000;

  protected async check(order: OrderData): Promise<ValidationResult> {
    const errors: string[] = [];

    if (order.totalAmount > this.highValueThreshold) {
      errors.push(
        `Order amount $${order.totalAmount} exceeds fraud threshold of $${this.highValueThreshold}`,
      );
    }

    if (
      order.shippingAddress &&
      this.suspiciousCountries.includes(order.shippingAddress.country?.toUpperCase())
    ) {
      errors.push(
        `Shipping to country "${order.shippingAddress.country}" is flagged for review`,
      );
    }

    const hasDuplicateItems = order.items.some(
      (item, index) =>
        order.items.findIndex((other) => other.name === item.name) !== index,
    );
    if (hasDuplicateItems) {
      errors.push('Duplicate items detected in order — potential fraud pattern');
    }

    return {
      valid: errors.length === 0,
      errors,
      handlerName: 'FraudDetection',
    };
  }
}
