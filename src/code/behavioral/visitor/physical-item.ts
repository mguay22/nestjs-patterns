import { OrderItemElement } from './order-item-element.interface';
import { OrderVisitor } from './order-visitor.interface';

export class PhysicalItem implements OrderItemElement {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly quantity: number,
    public readonly weight: number = 1,
  ) {}

  accept(visitor: OrderVisitor): number {
    return visitor.visitPhysicalItem(this);
  }
}
