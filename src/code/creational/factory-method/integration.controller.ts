import { Controller, Post, Body } from '@nestjs/common';
import { ProductCreationService } from './integration.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productCreation: ProductCreationService) {}

  @Post()
  createProduct(@Body() body: { type: string; name: string; price: number }) {
    return this.productCreation.createProduct(body);
  }
}
