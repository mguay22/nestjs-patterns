import { IterableCollection, Iterator, Product } from './iterator.interface';
import { PriceAscendingIterator } from './price-ascending.iterator';
import { CategoryIterator } from './category.iterator';
import { PaginatedIterator } from './paginated.iterator';

export class ProductCollection implements IterableCollection<Product> {
  private readonly products: Product[];

  constructor() {
    this.products = [
      { id: '1', name: 'Laptop', price: 999.99, category: 'electronics' },
      { id: '2', name: 'Headphones', price: 49.99, category: 'electronics' },
      { id: '3', name: 'Running Shoes', price: 89.99, category: 'sports' },
      { id: '4', name: 'Novel', price: 14.99, category: 'books' },
      { id: '5', name: 'Smartphone', price: 699.99, category: 'electronics' },
      { id: '6', name: 'Yoga Mat', price: 29.99, category: 'sports' },
      { id: '7', name: 'Cookbook', price: 24.99, category: 'books' },
      { id: '8', name: 'Tablet', price: 449.99, category: 'electronics' },
      { id: '9', name: 'Tennis Racket', price: 159.99, category: 'sports' },
      { id: '10', name: 'Science Fiction Anthology', price: 19.99, category: 'books' },
      { id: '11', name: 'Monitor', price: 349.99, category: 'electronics' },
      { id: '12', name: 'Basketball', price: 34.99, category: 'sports' },
    ];
  }

  createIterator(): Iterator<Product> {
    return this.createPriceAscendingIterator();
  }

  createPriceAscendingIterator(): PriceAscendingIterator {
    return new PriceAscendingIterator(this.products);
  }

  createCategoryIterator(category: string): CategoryIterator {
    return new CategoryIterator(this.products, category);
  }

  createPaginatedIterator(pageSize: number): PaginatedIterator {
    return new PaginatedIterator(this.products, pageSize);
  }

  getAll(): Product[] {
    return [...this.products];
  }

  getTotalCount(): number {
    return this.products.length;
  }
}
