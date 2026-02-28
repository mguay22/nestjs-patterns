import { Injectable } from '@nestjs/common';
import { OrderMediatorService } from './order-mediator.service';

@Injectable()
export class OrderService {
  constructor(private readonly mediator: OrderMediatorService) {}

  placeOrder(body: {
    items: { name: string; qty: number; price: number }[];
    paymentMethod: string;
    shippingAddress: Record<string, string>;
    customerEmail: string;
  }) {
    return this.mediator.placeOrder(body);
  }
}
