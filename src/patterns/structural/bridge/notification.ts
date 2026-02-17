import {
  NotificationSender,
  NotificationResult,
} from './notification-sender.interface.js';

export abstract class Notification {
  constructor(protected readonly sender: NotificationSender) {}

  abstract buildSubject(): string;
  abstract buildBody(): string;

  notify(to: string): NotificationResult {
    const subject = this.buildSubject();
    const body = this.buildBody();
    return this.sender.send(to, subject, body);
  }
}
