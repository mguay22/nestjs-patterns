import { CartMemento, CartItem } from './cart-memento';

export class ShoppingCart {
  private items: CartItem[] = [];

  addItem(item: CartItem): void {
    const existing = this.items.find((i) => i.name === item.name);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.push({ ...item });
    }
  }

  removeItem(name: string): boolean {
    const index = this.items.findIndex((i) => i.name === name);
    if (index === -1) {
      return false;
    }
    this.items.splice(index, 1);
    return true;
  }

  getItems(): CartItem[] {
    return this.items.map((item) => ({ ...item }));
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  save(): CartMemento {
    return new CartMemento(this.items);
  }

  restore(memento: CartMemento): void {
    this.items = memento.getItems();
  }
}
