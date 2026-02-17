import { Injectable } from '@nestjs/common';
import { ProductCreator, CreateProductData } from './product-creator';
import { Product } from './product.interface';

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
