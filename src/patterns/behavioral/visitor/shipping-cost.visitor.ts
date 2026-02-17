import { OrderVisitor } from './order-visitor.interface.js';

export class ShippingCostVisitor implements OrderVisitor {
  visitPhysicalItem(item: { name: string; price: number; quantity: number; weight?: number }): number {
    // $5.99 per physical item
    return Math.round(5.99 * item.quantity * 100) / 100;
  }

  visitDigitalItem(_item: { name: string; price: number; quantity: number }): number {
    // No shipping for digital items
    return 0;
  }

  visitSubscriptionItem(_item: { name: string; price: number; quantity: number }): number {
    // No shipping for subscriptions
    return 0;
  }
}
