import { OrderValidator, OrderData, ValidationResult } from './order-validator.interface.js';

export class InventoryCheckHandler extends OrderValidator {
  private readonly outOfStockItems = ['discontinued-widget', 'old-model-phone'];

  protected async check(order: OrderData): Promise<ValidationResult> {
    const errors: string[] = [];

    for (const item of order.items) {
      if (this.outOfStockItems.includes(item.name.toLowerCase())) {
        errors.push(`Item "${item.name}" is out of stock`);
      }
      if (item.qty <= 0) {
        errors.push(`Item "${item.name}" has invalid quantity: ${item.qty}`);
      }
      if (item.qty > 100) {
        errors.push(`Item "${item.name}" exceeds maximum quantity of 100`);
      }
    }

    if (order.items.length === 0) {
      errors.push('Order must contain at least one item');
    }

    return {
      valid: errors.length === 0,
      errors,
      handlerName: 'InventoryCheck',
    };
  }
}
