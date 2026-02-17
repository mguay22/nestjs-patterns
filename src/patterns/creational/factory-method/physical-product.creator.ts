import { Injectable } from '@nestjs/common';
import { ProductCreator, CreateProductData } from './product-creator';
import { Product } from './product.interface';

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
