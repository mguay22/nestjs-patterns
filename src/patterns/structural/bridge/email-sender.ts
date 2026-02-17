import {
  NotificationSender,
  NotificationResult,
} from './notification-sender.interface';

export class EmailSender implements NotificationSender {
  send(to: string, subject: string, body: string): NotificationResult {
    return {
      channel: 'email',
      recipient: to,
      status: `Email sent to ${to} with subject "${subject}"`,
    };
  }
}
