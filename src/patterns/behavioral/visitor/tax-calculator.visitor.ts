import { OrderVisitor } from './order-visitor.interface.js';

export class TaxCalculatorVisitor implements OrderVisitor {
  visitPhysicalItem(item: { name: string; price: number; quantity: number }): number {
    // 10% tax on physical items
    return Math.round(item.price * item.quantity * 0.10 * 100) / 100;
  }

  visitDigitalItem(item: { name: string; price: number; quantity: number }): number {
    // 5% tax on digital items (some jurisdictions have lower digital taxes)
    return Math.round(item.price * item.quantity * 0.05 * 100) / 100;
  }

  visitSubscriptionItem(item: { name: string; price: number; quantity: number }): number {
    // 8% tax on subscriptions
    return Math.round(item.price * item.quantity * 0.08 * 100) / 100;
  }
}
