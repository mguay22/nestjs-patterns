import { Notification } from './notification.js';
import { NotificationSender } from './notification-sender.interface.js';

export class ShippingUpdateNotification extends Notification {
  constructor(
    sender: NotificationSender,
    private readonly orderId: string,
  ) {
    super(sender);
  }

  buildSubject(): string {
    return `Shipping Update - Order #${this.orderId}`;
  }

  buildBody(): string {
    return `Your order #${this.orderId} has been shipped and is on its way. Track your shipment for real-time updates.`;
  }
}
