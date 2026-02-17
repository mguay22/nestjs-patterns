import { OrderVisitor } from './order-visitor.interface.js';

export class DiscountVisitor implements OrderVisitor {
  visitPhysicalItem(_item: { name: string; price: number; quantity: number }): number {
    // No discount on physical items
    return 0;
  }

  visitDigitalItem(item: { name: string; price: number; quantity: number }): number {
    // 15% off digital items
    return Math.round(item.price * item.quantity * 0.15 * 100) / 100;
  }

  visitSubscriptionItem(item: { name: string; price: number; quantity: number }): number {
    // 20% off subscriptions (annual discount)
    return Math.round(item.price * item.quantity * 0.20 * 100) / 100;
  }
}
