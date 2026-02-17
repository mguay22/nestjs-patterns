import { Controller, Get, Post, Body } from '@nestjs/common';
import { CartHistoryService } from './cart-history.service.js';

@Controller('memento')
export class MementoController {
  constructor(private readonly cartHistory: CartHistoryService) {}

  @Get('cart')
  getCart() {
    const cart = this.cartHistory.getCart();
    return {
      items: cart.getItems(),
      total: Math.round(cart.getTotal() * 100) / 100,
    };
  }

  @Post('cart/add')
  addItem(@Body() body: { name: string; price: number; quantity: number }) {
    const cart = this.cartHistory.getCart();

    // Save current state before modification
    const snapshot = cart.save();
    this.cartHistory.push(snapshot);

    cart.addItem({ name: body.name, price: body.price, quantity: body.quantity });

    return {
      message: `Added ${body.quantity}x "${body.name}" to cart`,
      items: cart.getItems(),
      total: Math.round(cart.getTotal() * 100) / 100,
    };
  }

  @Post('cart/undo')
  undo() {
    const memento = this.cartHistory.undo();

    if (!memento) {
      return { message: 'Nothing to undo', items: [], total: 0 };
    }

    const cart = this.cartHistory.getCart();

    return {
      message: 'Undo successful — restored to previous state',
      restoredTo: memento.getTimestamp(),
      items: cart.getItems(),
      total: Math.round(cart.getTotal() * 100) / 100,
    };
  }

  @Post('cart/redo')
  redo() {
    const memento = this.cartHistory.redo();

    if (!memento) {
      return { message: 'Nothing to redo', items: [], total: 0 };
    }

    const cart = this.cartHistory.getCart();

    return {
      message: 'Redo successful — restored forward state',
      restoredTo: memento.getTimestamp(),
      items: cart.getItems(),
      total: Math.round(cart.getTotal() * 100) / 100,
    };
  }

  @Get('cart/history')
  getHistory() {
    return {
      snapshots: this.cartHistory.getHistory(),
      currentCart: {
        items: this.cartHistory.getCart().getItems(),
        total: Math.round(this.cartHistory.getCart().getTotal() * 100) / 100,
      },
    };
  }
}
