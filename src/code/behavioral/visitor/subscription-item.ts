import { OrderItemElement } from './order-item-element.interface';
import { OrderVisitor } from './order-visitor.interface';

export class SubscriptionItem implements OrderItemElement {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly quantity: number,
  ) {}

  accept(visitor: OrderVisitor): number {
    return visitor.visitSubscriptionItem(this);
  }
}
