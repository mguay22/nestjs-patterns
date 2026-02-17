import { Prototype } from './product-prototype.interface.js';

export class ProductTemplate implements Prototype<ProductTemplate> {
  constructor(
    public name: string,
    public price: number,
    public category: string,
    public attributes: Record<string, unknown>,
  ) {}

  clone(): ProductTemplate {
    return new ProductTemplate(
      this.name,
      this.price,
      this.category,
      structuredClone(this.attributes),
    );
  }
}
