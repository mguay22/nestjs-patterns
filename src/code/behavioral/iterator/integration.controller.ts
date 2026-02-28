import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './integration.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  listProducts(@Query('sort') sort?: string, @Query('category') category?: string) {
    return this.productService.listProducts(sort, category);
  }

  @Get('paginated')
  listPaginated(@Query('pageSize') pageSize: string = '3') {
    return this.productService.listPaginated(parseInt(pageSize));
  }
}
