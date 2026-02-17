export interface ValidationResult {
  valid: boolean;
  errors: string[];
  handlerName: string;
}

export interface OrderData {
  items: { name: string; price: number; qty: number }[];
  paymentMethod: string;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
}

export abstract class OrderValidator {
  private nextHandler: OrderValidator | null = null;

  setNext(handler: OrderValidator): OrderValidator {
    this.nextHandler = handler;
    return handler;
  }

  async validate(order: OrderData): Promise<ValidationResult[]> {
    const result = await this.check(order);
    const results = [result];

    if (this.nextHandler) {
      const nextResults = await this.nextHandler.validate(order);
      results.push(...nextResults);
    }

    return results;
  }

  protected abstract check(order: OrderData): Promise<ValidationResult>;
}
