import { Product } from './product.interface.js';

export interface CreateProductData {
  name: string;
  price: number;
}

export abstract class ProductCreator {
  abstract createProduct(data: CreateProductData): Product;

  getProduct(data: CreateProductData): Product & { createdAt: string; sku: string } {
    const product = this.createProduct(data);

    return {
      ...product,
      createdAt: new Date().toISOString(),
      sku: `${product.type.toUpperCase()}-${Date.now()}`,
    };
  }
}
