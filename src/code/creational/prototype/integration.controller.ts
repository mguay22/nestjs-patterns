import { Controller, Get, Post, Param } from '@nestjs/common';
import { ProductTemplateService } from './integration.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productTemplate: ProductTemplateService) {}

  @Get('templates')
  listTemplates() {
    return this.productTemplate.listTemplates();
  }

  @Post('from-template/:id')
  createFromTemplate(@Param('id') id: string) {
    return this.productTemplate.createFromTemplate(id);
  }
}
