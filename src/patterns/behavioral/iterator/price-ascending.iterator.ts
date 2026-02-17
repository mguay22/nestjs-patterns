import { Iterator, Product } from './iterator.interface';

export class PriceAscendingIterator implements Iterator<Product> {
  private position = 0;
  private readonly sortedProducts: Product[];

  constructor(products: Product[]) {
    this.sortedProducts = [...products].sort((a, b) => a.price - b.price);
  }

  hasNext(): boolean {
    return this.position < this.sortedProducts.length;
  }

  next(): Product {
    if (!this.hasNext()) {
      throw new Error('No more elements');
    }
    const product = this.sortedProducts[this.position];
    this.position++;
    return product;
  }

  reset(): void {
    this.position = 0;
  }
}
