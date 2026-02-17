import {
  NotificationSender,
  NotificationResult,
} from './notification-sender.interface';

export class PushSender implements NotificationSender {
  send(to: string, subject: string, body: string): NotificationResult {
    return {
      channel: 'push',
      recipient: to,
      status: `Push notification sent to ${to}: ${subject}`,
    };
  }
}
