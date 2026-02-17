import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OrderItemElement } from './order-item-element.interface.js';
import { PhysicalItem } from './physical-item.js';
import { DigitalItem } from './digital-item.js';
import { SubscriptionItem } from './subscription-item.js';
import { TaxCalculatorVisitor } from './tax-calculator.visitor.js';
import { ShippingCostVisitor } from './shipping-cost.visitor.js';
import { DiscountVisitor } from './discount.visitor.js';

interface ItemInput {
  type: 'physical' | 'digital' | 'subscription';
  name: string;
  price: number;
  quantity: number;
  weight?: number;
}

@Controller('visitor')
export class VisitorController {
  @Post('orders/analyze')
  analyzeOrder(@Body() body: { items: ItemInput[] }) {
    if (!body.items || body.items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }

    const elements: OrderItemElement[] = body.items.map((item) => {
      switch (item.type) {
        case 'physical':
          return new PhysicalItem(item.name, item.price, item.quantity, item.weight);
        case 'digital':
          return new DigitalItem(item.name, item.price, item.quantity);
        case 'subscription':
          return new SubscriptionItem(item.name, item.price, item.quantity);
        default:
          throw new BadRequestException(
            `Unknown item type "${item.type}". Valid types: physical, digital, subscription`,
          );
      }
    });

    const taxVisitor = new TaxCalculatorVisitor();
    const shippingVisitor = new ShippingCostVisitor();
    const discountVisitor = new DiscountVisitor();

    const itemAnalysis = elements.map((element, index) => {
      const input = body.items[index];
      const subtotal = Math.round(element.price * element.quantity * 100) / 100;
      const tax = element.accept(taxVisitor);
      const shipping = element.accept(shippingVisitor);
      const discount = element.accept(discountVisitor);

      return {
        name: element.name,
        type: input.type,
        price: element.price,
        quantity: element.quantity,
        subtotal,
        tax,
        shipping,
        discount,
        total: Math.round((subtotal + tax + shipping - discount) * 100) / 100,
      };
    });

    const totals = {
      subtotal: Math.round(itemAnalysis.reduce((sum, i) => sum + i.subtotal, 0) * 100) / 100,
      tax: Math.round(itemAnalysis.reduce((sum, i) => sum + i.tax, 0) * 100) / 100,
      shipping: Math.round(itemAnalysis.reduce((sum, i) => sum + i.shipping, 0) * 100) / 100,
      discount: Math.round(itemAnalysis.reduce((sum, i) => sum + i.discount, 0) * 100) / 100,
      grandTotal: Math.round(itemAnalysis.reduce((sum, i) => sum + i.total, 0) * 100) / 100,
    };

    return {
      items: itemAnalysis,
      totals,
    };
  }
}
