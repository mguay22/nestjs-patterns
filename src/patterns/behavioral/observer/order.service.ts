import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './order-event.js';

@Injectable()
export class OrderService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  createOrder(data: {
    items: { name: string; price: number; quantity: number }[];
    customerEmail: string;
  }) {
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const event = new OrderCreatedEvent({
      orderId,
      items: data.items,
      totalAmount,
      customerEmail: data.customerEmail,
    });

    this.eventEmitter.emit('order.created', event);

    return {
      orderId,
      totalAmount: Math.round(totalAmount * 100) / 100,
      timestamp: event.timestamp,
    };
  }
}
