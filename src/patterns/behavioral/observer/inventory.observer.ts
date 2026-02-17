import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './order-event.js';

@Injectable()
export class InventoryObserver {
  private readonly logger = new Logger(InventoryObserver.name);

  @OnEvent('order.created')
  handleOrderCreated(event: OrderCreatedEvent): void {
    this.logger.log(
      `Updating inventory for order ${event.orderId}: ${event.items.length} item(s)`,
    );

    for (const item of event.items) {
      this.logger.log(
        `  - Reducing stock for "${item.name}" by ${item.quantity}`,
      );
    }

    this.logger.log(`Inventory update complete for order ${event.orderId}`);
  }
}
