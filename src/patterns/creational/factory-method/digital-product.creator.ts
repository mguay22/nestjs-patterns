import { Injectable } from '@nestjs/common';
import { ProductCreator, CreateProductData } from './product-creator.js';
import { Product } from './product.interface.js';

@Injectable()
export class DigitalProductCreator extends ProductCreator {
  createProduct(data: CreateProductData): Product {
    return {
      name: data.name,
      price: data.price,
      type: 'digital',
      details: {
        downloadUrl: `https://downloads.example.com/${data.name.toLowerCase().replace(/\s+/g, '-')}`,
        fileSize: '250MB',
        format: 'ZIP',
        licenseType: 'single-user',
      },
    };
  }
}
