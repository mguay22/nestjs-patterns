export class OrderCreatedEvent {
  readonly orderId: string;
  readonly items: { name: string; price: number; quantity: number }[];
  readonly totalAmount: number;
  readonly customerEmail: string;
  readonly timestamp: string;

  constructor(data: {
    orderId: string;
    items: { name: string; price: number; quantity: number }[];
    totalAmount: number;
    customerEmail: string;
  }) {
    this.orderId = data.orderId;
    this.items = data.items;
    this.totalAmount = data.totalAmount;
    this.customerEmail = data.customerEmail;
    this.timestamp = new Date().toISOString();
  }
}
