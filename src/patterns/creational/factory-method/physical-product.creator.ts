import { Injectable } from '@nestjs/common';
import { ProductCreator, CreateProductData } from './product-creator.js';
import { Product } from './product.interface.js';

@Injectable()
export class PhysicalProductCreator extends ProductCreator {
  createProduct(data: CreateProductData): Product {
    return {
      name: data.name,
      price: data.price,
      type: 'physical',
      details: {
        weight: '0.5kg',
        dimensions: '30x20x10cm',
        shippingRequired: true,
        warehouse: 'WH-001',
      },
    };
  }
}
