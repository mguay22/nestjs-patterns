export interface NotificationResult {
  channel: string;
  recipient: string;
  status: string;
}

export interface NotificationSender {
  send(to: string, subject: string, body: string): NotificationResult;
}
