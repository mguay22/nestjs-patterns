import { Controller, Get } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('composite')
export class CompositeController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('catalog')
  getCatalog() {
    const catalog = this.catalogService.buildCatalog();

    return {
      totalPrice: parseFloat(catalog.getPrice().toFixed(2)),
      totalItems: catalog.getCount(),
      structure: catalog.display(),
    };
  }
}
