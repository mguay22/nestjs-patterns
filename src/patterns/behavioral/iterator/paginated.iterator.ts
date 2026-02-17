import { Iterator, Product } from './iterator.interface.js';

export class PaginatedIterator implements Iterator<Product[]> {
  private currentPage = 0;
  private readonly pages: Product[][];

  constructor(products: Product[], pageSize: number) {
    this.pages = [];
    for (let i = 0; i < products.length; i += pageSize) {
      this.pages.push(products.slice(i, i + pageSize));
    }
  }

  hasNext(): boolean {
    return this.currentPage < this.pages.length;
  }

  next(): Product[] {
    if (!this.hasNext()) {
      throw new Error('No more pages');
    }
    const page = this.pages[this.currentPage];
    this.currentPage++;
    return page;
  }

  reset(): void {
    this.currentPage = 0;
  }

  getTotalPages(): number {
    return this.pages.length;
  }
}
