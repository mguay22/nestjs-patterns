import { OrderValidator, OrderData, ValidationResult } from './order-validator.interface';

export class AddressValidationHandler extends OrderValidator {
  protected async check(order: OrderData): Promise<ValidationResult> {
    const errors: string[] = [];
    const address = order.shippingAddress;

    if (!address) {
      errors.push('Shipping address is required');
      return { valid: false, errors, handlerName: 'AddressValidation' };
    }

    if (!address.street || address.street.trim().length === 0) {
      errors.push('Street address is required');
    }

    if (!address.city || address.city.trim().length === 0) {
      errors.push('City is required');
    }

    if (!address.zip || address.zip.trim().length === 0) {
      errors.push('ZIP code is required');
    } else if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(address.zip)) {
      errors.push('Invalid ZIP code format');
    }

    if (!address.country || address.country.trim().length === 0) {
      errors.push('Country is required');
    } else if (address.country.trim().length < 2) {
      errors.push('Country code must be at least 2 characters');
    }

    return {
      valid: errors.length === 0,
      errors,
      handlerName: 'AddressValidation',
    };
  }
}
