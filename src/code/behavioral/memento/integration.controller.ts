import { Controller, Post, Body, Get } from '@nestjs/common';
import { CartService } from './integration.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  addItem(@Body() body: { name: string; price: number; quantity: number }) {
    return this.cartService.addItem(body);
  }

  @Post('undo')
  undo() {
    return this.cartService.undo();
  }

  @Post('redo')
  redo() {
    return this.cartService.redo();
  }

  @Get('history')
  getHistory() {
    return this.cartService.getHistory();
  }
}
