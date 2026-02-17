import { OrderValidator, OrderData, ValidationResult } from './order-validator.interface.js';

export class PaymentValidationHandler extends OrderValidator {
  private readonly validPaymentMethods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer'];

  protected async check(order: OrderData): Promise<ValidationResult> {
    const errors: string[] = [];

    if (!order.paymentMethod) {
      errors.push('Payment method is required');
    } else if (!this.validPaymentMethods.includes(order.paymentMethod.toLowerCase())) {
      errors.push(
        `Invalid payment method "${order.paymentMethod}". Accepted: ${this.validPaymentMethods.join(', ')}`,
      );
    }

    if (order.totalAmount <= 0) {
      errors.push('Total amount must be greater than zero');
    }

    const calculatedTotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (Math.abs(calculatedTotal - order.totalAmount) > 0.01) {
      errors.push(
        `Total amount mismatch: expected ${calculatedTotal.toFixed(2)}, got ${order.totalAmount.toFixed(2)}`,
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      handlerName: 'PaymentValidation',
    };
  }
}
