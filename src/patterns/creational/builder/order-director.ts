import { OrderBuilder } from './order-builder.js';
import { Order } from './order.js';

export interface DirectorItem {
  name: string;
  price: number;
  quantity: number;
}

export class OrderDirector {
  static createExpressOrder(builder: OrderBuilder, items: DirectorItem[]): Order {
    for (const item of items) {
      builder.addItem(item.name, item.price, item.quantity);
    }

    return builder
      .setShipping('express', 'Default Express Address')
      .setPaymentMethod('credit-card')
      .applyDiscount(0)
      .build();
  }

  static createGiftOrder(
    builder: OrderBuilder,
    items: DirectorItem[],
    recipientAddress: string,
  ): Order {
    for (const item of items) {
      builder.addItem(item.name, item.price, item.quantity);
    }

    return builder
      .setShipping('gift-wrap', recipientAddress)
      .setPaymentMethod('credit-card')
      .applyDiscount(5)
      .build();
  }
}
