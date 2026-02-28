import { Injectable } from '@nestjs/common';
import { CartHistoryService } from './cart-history.service';

@Injectable()
export class CartService {
  constructor(private readonly cartHistory: CartHistoryService) {}

  addItem(body: { name: string; price: number; quantity: number }) {
    const cart = this.cartHistory.getCart();
    this.cartHistory.push(cart.save());
    cart.addItem(body);
    return { items: cart.getItems(), total: cart.getTotal() };
  }

  undo() {
    return this.cartHistory.undo();
  }

  redo() {
    return this.cartHistory.redo();
  }

  getHistory() {
    return this.cartHistory.getHistory();
  }
}
