import { Injectable } from '@nestjs/common';
import { TaxCalculatorVisitor } from './tax-calculator.visitor';
import { DiscountVisitor } from './discount.visitor';
import { ShippingCostVisitor } from './shipping-cost.visitor';
import { PhysicalItem } from './physical-item';
import { DigitalItem } from './digital-item';
import { SubscriptionItem } from './subscription-item';
import type { OrderItemElement } from './order-item-element.interface';

@Injectable()
export class OrderAnalysisService {
  analyzeOrder(
    items: { type: string; name: string; price: number; quantity: number }[],
  ) {
    const elements: OrderItemElement[] = items.map((item) => {
      switch (item.type) {
        case 'digital':
          return new DigitalItem(item.name, item.price, item.quantity);
        case 'subscription':
          return new SubscriptionItem(item.name, item.price, item.quantity);
        default:
          return new PhysicalItem(item.name, item.price, item.quantity);
      }
    });

    const tax = new TaxCalculatorVisitor();
    const discount = new DiscountVisitor();
    const shipping = new ShippingCostVisitor();

    return {
      tax: elements.map((el) => el.accept(tax)),
      discounts: elements.map((el) => el.accept(discount)),
      shipping: elements.map((el) => el.accept(shipping)),
    };
  }
}
