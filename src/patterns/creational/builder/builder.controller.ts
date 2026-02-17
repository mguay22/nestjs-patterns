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
  @Post('orders')
  createOrder(@Body() dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }

    const builder = new OrderBuilder();

    if (dto.preset === 'express') {
      return OrderDirector.createExpressOrder(builder, dto.items);
    }

    if (dto.preset === 'gift') {
      const address = dto.recipientAddress ?? '123 Gift Street';
      return OrderDirector.createGiftOrder(builder, dto.items, address);
    }

    for (const item of dto.items) {
      builder.addItem(item.name, item.price, item.quantity);
    }

    if (dto.shipping) {
      builder.setShipping(dto.shipping.method, dto.shipping.address);
    }

    if (dto.discount !== undefined) {
      builder.applyDiscount(dto.discount);
    }

    if (dto.paymentMethod) {
      builder.setPaymentMethod(dto.paymentMethod);
    }

    return builder.build();
  }
}
