import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './order-event';

@Injectable()
export class EmailObserver {
  private readonly logger = new Logger(EmailObserver.name);

  @OnEvent('order.created')
  handleOrderCreated(event: OrderCreatedEvent): void {
    this.logger.log(
      `Sending order confirmation email to ${event.customerEmail}`,
    );
    this.logger.log(
      `  - Order ID: ${event.orderId}`,
    );
    this.logger.log(
      `  - Total: $${event.totalAmount.toFixed(2)}`,
    );
    this.logger.log(
      `  - Items: ${event.items.map((i) => i.name).join(', ')}`,
    );
    this.logger.log(`Email sent successfully to ${event.customerEmail}`);
  }
}
