import { Injectable } from '@nestjs/common';
import { Product, ProductCatalog } from './product-catalog.interface.js';

@Injectable()
export class ProductCatalogService implements ProductCatalog {
  private readonly products: Product[] = [
    { id: '1', name: 'Wireless Headphones', price: 79.99, category: 'Electronics' },
    { id: '2', name: 'Leather Wallet', price: 49.99, category: 'Accessories' },
    { id: '3', name: 'Running Shoes', price: 119.99, category: 'Footwear' },
    { id: '4', name: 'Coffee Maker', price: 89.99, category: 'Kitchen' },
    { id: '5', name: 'Backpack', price: 59.99, category: 'Accessories' },
  ];

  getProduct(id: string): Product | null {
    // Simulate a slow database lookup (500ms delay in real scenario)
    const start = Date.now();
    while (Date.now() - start < 500) {
      // busy-wait to simulate delay
    }

    return this.products.find((p) => p.id === id) ?? null;
  }

  listProducts(): Product[] {
    return [...this.products];
  }
}
