import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductVariantService } from './integration.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productVariant: ProductVariantService) {}

  @Post('variants')
  createVariant(
    @Body()
    body: {
      sku: string;
      color: string;
      size: string;
      typeName: string;
      description: string;
      basePrice: number;
      category: string;
    },
  ) {
    return this.productVariant.createVariant(body);
  }

  @Get('types/count')
  getTypeCount() {
    return this.productVariant.getTypeCount();
  }
}
