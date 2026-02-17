import { OrderVisitor } from './order-visitor.interface.js';

export interface OrderItemElement {
  name: string;
  price: number;
  quantity: number;
  accept(visitor: OrderVisitor): number;
}
