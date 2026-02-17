import { Notification } from './notification.js';
import { NotificationSender } from './notification-sender.interface.js';

export class OrderConfirmationNotification extends Notification {
  constructor(
    sender: NotificationSender,
    private readonly orderId: string,
  ) {
    super(sender);
  }

  buildSubject(): string {
    return `Order Confirmation - #${this.orderId}`;
  }

  buildBody(): string {
    return `Thank you for your order #${this.orderId}. Your order has been confirmed and is being processed.`;
  }
}
