import {
  NotificationSender,
  NotificationResult,
} from './notification-sender.interface.js';

export class SmsSender implements NotificationSender {
  send(to: string, subject: string, body: string): NotificationResult {
    return {
      channel: 'sms',
      recipient: to,
      status: `SMS sent to ${to}: ${subject} - ${body}`,
    };
  }
}
