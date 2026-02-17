import { Injectable } from '@nestjs/common';

export interface NotificationResult {
  sent: boolean;
  messageId: string;
}

@Injectable()
export class NotificationService {
  sendConfirmation(
    email: string,
    orderDetails: { orderId: string; total: number },
  ): NotificationResult {
    return {
      sent: true,
      messageId: `MSG-${Date.now()}`,
    };
  }
}
