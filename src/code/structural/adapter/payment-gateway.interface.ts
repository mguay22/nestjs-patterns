export interface PaymentResult {
  success: boolean;
  transactionId: string;
  gateway: string;
}

export interface PaymentGateway {
  charge(amount: number, currency: string): PaymentResult;
}
