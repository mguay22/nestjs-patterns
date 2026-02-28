import { Controller, Get } from '@nestjs/common';
import { CatalogDisplayService } from './integration.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogDisplay: CatalogDisplayService) {}

  @Get()
  getCatalog() {
    return this.catalogDisplay.getCatalog();
  }
}
