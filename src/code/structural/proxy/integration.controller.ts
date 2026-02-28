import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogAccessService } from './integration.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogAccess: CatalogAccessService) {}

  @Get()
  listProducts(@Query('role') role: string = 'user') {
    return this.catalogAccess.listProducts(role);
  }

  @Get(':id')
  getProduct(@Param('id') id: string, @Query('role') role: string = 'user') {
    return this.catalogAccess.getProduct(id, role);
  }
}
