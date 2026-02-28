import { Injectable } from '@nestjs/common';
import { AccessControlProxyService } from './access-control-proxy.service';

@Injectable()
export class CatalogAccessService {
  constructor(private readonly catalog: AccessControlProxyService) {}

  listProducts(role: string) {
    return this.catalog.listProducts(role);
  }

  getProduct(id: string, role: string) {
    return this.catalog.getProduct(id, role);
  }
}
