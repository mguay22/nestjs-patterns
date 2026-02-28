import { Injectable } from '@nestjs/common';

export interface PaymentResult {
  success: boolean;
  transactionId: string;
}

@Injectable()
export class PaymentService {
  processPayment(amount: number, method: string): PaymentResult {
    return {
      success: true,
      transactionId: `TXN-${method.toUpperCase()}-${Date.now()}`,
    };
  }
}
