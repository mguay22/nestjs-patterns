export interface PaymentProcessor {
  processPayment(amount: number): {
    success: boolean;
    transactionId: string;
    provider: string;
  };
}

export interface RefundHandler {
  processRefund(
    transactionId: string,
    amount: number,
  ): {
    success: boolean;
    refundId: string;
    provider: string;
  };
}
