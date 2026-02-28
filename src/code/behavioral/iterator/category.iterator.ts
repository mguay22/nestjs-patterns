import { Iterator, Product } from './iterator.interface';

export class CategoryIterator implements Iterator<Product> {
  private position = 0;
  private readonly filteredProducts: Product[];

  constructor(products: Product[], category: string) {
    this.filteredProducts = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }

  hasNext(): boolean {
    return this.position < this.filteredProducts.length;
  }

  next(): Product {
    if (!this.hasNext()) {
      throw new Error('No more elements');
    }
    const product = this.filteredProducts[this.position];
    this.position++;
    return product;
  }

  reset(): void {
    this.position = 0;
  }
}
