import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { PhysicalProductCreator } from './physical-product.creator';
import { DigitalProductCreator } from './digital-product.creator';
import { SubscriptionProductCreator } from './subscription-product.creator';
import { ProductCreator } from './product-creator';

interface CreateProductDto {
  type: 'physical' | 'digital' | 'subscription';
  name: string;
  price: number;
}

@Controller('factory-method')
export class FactoryMethodController {
  private readonly creators: Record<string, ProductCreator>;

  constructor(
    private readonly physicalCreator: PhysicalProductCreator,
    private readonly digitalCreator: DigitalProductCreator,
    private readonly subscriptionCreator: SubscriptionProductCreator,
  ) {
    this.creators = {
      physical: this.physicalCreator,
      digital: this.digitalCreator,
      subscription: this.subscriptionCreator,
    };
  }

  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    const creator = this.creators[dto.type];

    if (!creator) {
      throw new BadRequestException(
        `Unknown product type: ${dto.type}. Valid types: physical, digital, subscription`,
      );
    }

    return creator.getProduct({ name: dto.name, price: dto.price });
  }
}
