import { Injectable } from '@nestjs/common';
import { OrderService } from './order.service';

@Injectable()
export class OrderCreationService {
  constructor(private readonly orderService: OrderService) {}

  createOrder(body: {
    items: { name: string; price: number; quantity: number }[];
    customerEmail: string;
  }) {
    return this.orderService.createOrder(body);
  }
}
