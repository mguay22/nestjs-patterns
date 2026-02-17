import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { OrderBuilder } from './order-builder';
import { OrderDirector } from './order-director';

interface OrderItemDto {
  name: string;
  price: number;
  quantity: number;
}

interface CreateOrderDto {
  preset?: 'express' | 'gift';
  items: OrderItemDto[];
  shipping?: { method: string; address: string };
  discount?: number;
  paymentMethod?: string;
  recipientAddress?: string;
}

@Controller('builder')
export class BuilderController {
  constructor(private readonly orderBuilder: OrderBuilder) {}

  @Post('orders')
  createOrder(@Body() dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }

    if (dto.preset === 'express') {
      return OrderDirector.createExpressOrder(this.orderBuilder, dto.items);
    }

    if (dto.preset === 'gift') {
      const address = dto.recipientAddress ?? '123 Gift Street';
      return OrderDirector.createGiftOrder(this.orderBuilder, dto.items, address);
    }

    for (const item of dto.items) {
      this.orderBuilder.addItem(item.name, item.price, item.quantity);
    }

    if (dto.shipping) {
      this.orderBuilder.setShipping(dto.shipping.method, dto.shipping.address);
    }

    if (dto.discount !== undefined) {
      this.orderBuilder.applyDiscount(dto.discount);
    }

    if (dto.paymentMethod) {
      this.orderBuilder.setPaymentMethod(dto.paymentMethod);
    }

    return this.orderBuilder.build();
  }
}
