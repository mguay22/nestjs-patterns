import { Injectable } from '@nestjs/common';
import { Order } from './order';

@Injectable()
export class OrderBuilder {
  private order: Order;

  constructor() {
    this.order = new Order();
  }

  addItem(name: string, price: number, quantity: number): this {
    this.order.items.push({ name, price, quantity });
    return this;
  }

  setShipping(method: string, address: string): this {
    this.order.shipping = { method, address };
    return this;
  }

  applyDiscount(percent: number): this {
    this.order.discount = percent;
    return this;
  }

  setPaymentMethod(method: string): this {
    this.order.paymentMethod = method;
    return this;
  }

  build(): Order {
    this.order.calculateTotal();
    const result = this.order;
    this.order = new Order();
    return result;
  }
}
