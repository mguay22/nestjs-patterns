import { Injectable } from '@nestjs/common';
import { OrderBuilder } from './order-builder';
import { OrderDirector } from './order-director';

@Injectable()
export class OrderBuildingService {
  createOrder(body: {
    type?: 'express' | 'gift';
    items: { name: string; price: number; quantity: number }[];
    recipientAddress?: string;
  }) {
    const builder = new OrderBuilder();

    if (body.type === 'express') {
      return OrderDirector.createExpressOrder(builder, body.items);
    }

    if (body.type === 'gift') {
      return OrderDirector.createGiftOrder(
        builder,
        body.items,
        body.recipientAddress ?? 'Default Address',
      );
    }

    for (const item of body.items) {
      builder.addItem(item.name, item.price, item.quantity);
    }

    return builder
      .setShipping('standard', 'Customer Address')
      .setPaymentMethod('credit-card')
      .build();
  }
}
