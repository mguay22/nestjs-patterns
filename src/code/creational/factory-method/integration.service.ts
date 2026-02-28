import { Injectable, BadRequestException } from '@nestjs/common';
import { PhysicalProductCreator } from './physical-product.creator';
import { DigitalProductCreator } from './digital-product.creator';
import { SubscriptionProductCreator } from './subscription-product.creator';
import type { ProductCreator } from './product-creator';

@Injectable()
export class ProductCreationService {
  private readonly creators: Record<string, ProductCreator>;

  constructor(
    physicalCreator: PhysicalProductCreator,
    digitalCreator: DigitalProductCreator,
    subscriptionCreator: SubscriptionProductCreator,
  ) {
    this.creators = {
      physical: physicalCreator,
      digital: digitalCreator,
      subscription: subscriptionCreator,
    };
  }

  createProduct(body: { type: string; name: string; price: number }) {
    const creator = this.creators[body.type];
    if (!creator) {
      throw new BadRequestException(
        `Unknown product type: ${body.type}. Available: ${Object.keys(this.creators).join(', ')}`,
      );
    }
    return creator.getProduct({ name: body.name, price: body.price });
  }
}
