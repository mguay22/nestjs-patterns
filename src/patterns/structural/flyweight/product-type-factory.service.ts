import { Injectable } from '@nestjs/common';
import { ProductType } from './product-type.js';

@Injectable()
export class ProductTypeFactoryService {
  private readonly cache = new Map<string, ProductType>();

  getProductType(
    typeName: string,
    description: string,
    basePrice: number,
    category: string,
  ): ProductType {
    if (!this.cache.has(typeName)) {
      this.cache.set(
        typeName,
        new ProductType(typeName, description, basePrice, category),
      );
    }

    return this.cache.get(typeName)!;
  }

  getTypeCount(): number {
    return this.cache.size;
  }
}
