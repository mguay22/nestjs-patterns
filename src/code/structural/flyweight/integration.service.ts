import { Injectable } from '@nestjs/common';
import { ProductTypeFactoryService } from './product-type-factory.service';
import { ProductVariant } from './product-variant';

@Injectable()
export class ProductVariantService {
  constructor(private readonly typeFactory: ProductTypeFactoryService) {}

  createVariant(body: {
    sku: string;
    color: string;
    size: string;
    typeName: string;
    description: string;
    basePrice: number;
    category: string;
  }) {
    const type = this.typeFactory.getProductType(
      body.typeName,
      body.description,
      body.basePrice,
      body.category,
    );
    return new ProductVariant(body.sku, body.color, body.size, type).getDetails();
  }

  getTypeCount() {
    return { cachedTypes: this.typeFactory.getTypeCount() };
  }
}
