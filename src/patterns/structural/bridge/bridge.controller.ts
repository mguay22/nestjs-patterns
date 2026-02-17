import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { NotificationSender } from './notification-sender.interface.js';
import { EmailSender } from './email-sender.js';
import { SmsSender } from './sms-sender.js';
import { PushSender } from './push-sender.js';
import { Notification } from './notification.js';
import { OrderConfirmationNotification } from './order-confirmation.notification.js';
import { ShippingUpdateNotification } from './shipping-update.notification.js';

interface NotifyDto {
  type: 'order-confirmation' | 'shipping-update';
  channel: 'email' | 'sms' | 'push';
  to: string;
  orderId: string;
}

@Controller('bridge')
export class BridgeController {
  @Post('notifications')
  sendNotification(@Body() dto: NotifyDto) {
    const sender = this.resolveSender(dto.channel);
    const notification = this.resolveNotification(dto.type, sender, dto.orderId);

    return notification.notify(dto.to);
  }

  private resolveSender(channel: string): NotificationSender {
    switch (channel) {
      case 'email':
        return new EmailSender();
      case 'sms':
        return new SmsSender();
      case 'push':
        return new PushSender();
      default:
        throw new BadRequestException(
          `Unknown channel: ${channel}. Valid channels: email, sms, push`,
        );
    }
  }

  private resolveNotification(
    type: string,
    sender: NotificationSender,
    orderId: string,
  ): Notification {
    switch (type) {
      case 'order-confirmation':
        return new OrderConfirmationNotification(sender, orderId);
      case 'shipping-update':
        return new ShippingUpdateNotification(sender, orderId);
      default:
        throw new BadRequestException(
          `Unknown notification type: ${type}. Valid types: order-confirmation, shipping-update`,
        );
    }
  }
}
