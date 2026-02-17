import { Injectable, ForbiddenException } from '@nestjs/common';
import type { Product, ProductCatalog } from './product-catalog.interface.js';

@Injectable()
export class AccessControlProxyService implements ProductCatalog {
  constructor(private readonly realCatalog: ProductCatalog) {}

  private checkAccess(role: string): void {
    const allowedRoles = ['admin', 'user'];
    if (!allowedRoles.includes(role)) {
      throw new ForbiddenException(
        `Role "${role}" does not have access to the product catalog`,
      );
    }
  }

  getProduct(id: string, role: string = 'user'): Product | null {
    this.checkAccess(role);
    return this.realCatalog.getProduct(id);
  }

  listProducts(role: string = 'user'): Product[] {
    this.checkAccess(role);
    return this.realCatalog.listProducts();
  }
}
