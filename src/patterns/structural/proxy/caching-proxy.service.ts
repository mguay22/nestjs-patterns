import { Injectable } from '@nestjs/common';
import { Product, ProductCatalog } from './product-catalog.interface';
import { ProductCatalogService } from './product-catalog.service';

@Injectable()
export class CachingProxyService implements ProductCatalog {
  private readonly cache = new Map<string, Product | null>();
  private cachedList: Product[] | null = null;

  constructor(private readonly realCatalog: ProductCatalogService) {}

  getProduct(id: string): Product | null {
    if (this.cache.has(id)) {
      return this.cache.get(id) ?? null;
    }

    const product = this.realCatalog.getProduct(id);
    this.cache.set(id, product);
    return product;
  }

  listProducts(): Product[] {
    if (this.cachedList) {
      return this.cachedList;
    }

    this.cachedList = this.realCatalog.listProducts();
    return this.cachedList;
  }

  isCached(id: string): boolean {
    return this.cache.has(id);
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}
