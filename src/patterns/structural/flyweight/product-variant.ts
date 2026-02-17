import { ProductType } from './product-type.js';

export class ProductVariant {
  constructor(
    public readonly sku: string,
    public readonly color: string,
    public readonly size: string,
    public readonly productType: ProductType,
  ) {}

  getDetails() {
    return {
      sku: this.sku,
      color: this.color,
      size: this.size,
      typeName: this.productType.typeName,
      description: this.productType.description,
      basePrice: this.productType.basePrice,
      category: this.productType.category,
    };
  }
}
