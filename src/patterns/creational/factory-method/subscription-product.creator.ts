import { Injectable } from '@nestjs/common';
import { ProductCreator, CreateProductData } from './product-creator.js';
import { Product } from './product.interface.js';

@Injectable()
export class SubscriptionProductCreator extends ProductCreator {
  createProduct(data: CreateProductData): Product {
    return {
      name: data.name,
      price: data.price,
      type: 'subscription',
      details: {
        billingCycle: 'monthly',
        duration: '12 months',
        autoRenew: true,
        trialPeriodDays: 14,
      },
    };
  }
}
