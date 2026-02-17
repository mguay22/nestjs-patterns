import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './order-event';

@Injectable()
export class AnalyticsObserver {
  private readonly logger = new Logger(AnalyticsObserver.name);

  @OnEvent('order.created')
  handleOrderCreated(event: OrderCreatedEvent): void {
    this.logger.log(
      `Tracking analytics for order ${event.orderId}: $${event.totalAmount.toFixed(2)} revenue`,
    );
    this.logger.log(
      `  - Customer: ${event.customerEmail}`,
    );
    this.logger.log(
      `  - Items purchased: ${event.items.length}`,
    );
    this.logger.log(
      `  - Timestamp: ${event.timestamp}`,
    );
  }
}
