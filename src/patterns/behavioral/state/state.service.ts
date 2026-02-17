import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderContext } from './order-context';

@Injectable()
export class StateService {
  private readonly orders = new Map<string, OrderContext>();

  createOrder(id?: string): OrderContext {
    const orderId = id ?? `ORD_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    if (this.orders.has(orderId)) {
      throw new BadRequestException(`Order ${orderId} already exists`);
    }

    const order = new OrderContext(orderId);
    this.orders.set(orderId, order);
    return order;
  }

  getOrder(id: string): OrderContext {
    const order = this.orders.get(id);
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  transition(id: string, action: string) {
    const order = this.getOrder(id);

    switch (action) {
      case 'confirm':
        return order.confirm();
      case 'ship':
        return order.ship();
      case 'deliver':
        return order.deliver();
      case 'cancel':
        return order.cancel();
      default:
        throw new BadRequestException(
          `Unknown action "${action}". Valid actions: confirm, ship, deliver, cancel`,
        );
    }
  }
}
