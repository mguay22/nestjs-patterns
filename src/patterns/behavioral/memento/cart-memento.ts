export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export class CartMemento {
  private readonly items: CartItem[];
  private readonly timestamp: string;

  constructor(items: CartItem[]) {
    this.items = items.map((item) => ({ ...item }));
    this.timestamp = new Date().toISOString();
  }

  getItems(): CartItem[] {
    return this.items.map((item) => ({ ...item }));
  }

  getTimestamp(): string {
    return this.timestamp;
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
