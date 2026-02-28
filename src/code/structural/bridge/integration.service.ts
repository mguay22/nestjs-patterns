import { Injectable } from '@nestjs/common';
import { EmailSender } from './email-sender';
import { SmsSender } from './sms-sender';
import { PushSender } from './push-sender';
import { OrderConfirmationNotification } from './order-confirmation.notification';
import { ShippingUpdateNotification } from './shipping-update.notification';
import type { NotificationSender } from './notification-sender.interface';

@Injectable()
export class NotificationService {
  send(body: { type: string; channel: string; orderId: string; to: string }) {
    const senders: Record<string, NotificationSender> = {
      email: new EmailSender(),
      sms: new SmsSender(),
      push: new PushSender(),
    };

    const sender = senders[body.channel];
    const notification =
      body.type === 'shipping'
        ? new ShippingUpdateNotification(sender, body.orderId)
        : new OrderConfirmationNotification(sender, body.orderId);

    return notification.notify(body.to);
  }
}
