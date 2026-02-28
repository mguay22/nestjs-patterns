import { Injectable } from '@nestjs/common';
import { CartMemento } from './cart-memento';
import { ShoppingCart } from './shopping-cart';

@Injectable()
export class CartHistoryService {
  private readonly undoStack: CartMemento[] = [];
  private readonly redoStack: CartMemento[] = [];
  private readonly cart: ShoppingCart;

  constructor() {
    this.cart = new ShoppingCart();
  }

  getCart(): ShoppingCart {
    return this.cart;
  }

  push(memento: CartMemento): void {
    this.undoStack.push(memento);
    this.redoStack.length = 0;
  }

  undo(): CartMemento | null {
    if (this.undoStack.length === 0) {
      return null;
    }

    const currentState = this.cart.save();
    this.redoStack.push(currentState);

    const memento = this.undoStack.pop()!;
    this.cart.restore(memento);

    return memento;
  }

  redo(): CartMemento | null {
    if (this.redoStack.length === 0) {
      return null;
    }

    const currentState = this.cart.save();
    this.undoStack.push(currentState);

    const memento = this.redoStack.pop()!;
    this.cart.restore(memento);

    return memento;
  }

  getHistory(): { timestamp: string; itemCount: number; total: number }[] {
    return this.undoStack.map((memento) => ({
      timestamp: memento.getTimestamp(),
      itemCount: memento.getItems().length,
      total: memento.getTotal(),
    }));
  }
}
