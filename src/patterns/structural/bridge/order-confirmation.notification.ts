import { Notification } from './notification';
import { NotificationSender } from './notification-sender.interface';

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
