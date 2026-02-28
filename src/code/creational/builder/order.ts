export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingInfo {
  method: string;
  address: string;
}

export class Order {
  items: OrderItem[] = [];
  shipping: ShippingInfo | null = null;
  discount: number = 0;
  paymentMethod: string = 'credit-card';
  total: number = 0;

  calculateTotal(): void {
    const subtotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const discountAmount = subtotal * (this.discount / 100);
    this.total = +(subtotal - discountAmount).toFixed(2);
  }
}
