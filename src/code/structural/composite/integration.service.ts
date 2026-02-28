import { Injectable } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Injectable()
export class CatalogDisplayService {
  constructor(private readonly catalogService: CatalogService) {}

  getCatalog() {
    const catalog = this.catalogService.buildCatalog();
    return {
      name: catalog.getName(),
      totalProducts: catalog.getCount(),
      totalValue: catalog.getPrice(),
      tree: catalog.display(),
    };
  }
}
