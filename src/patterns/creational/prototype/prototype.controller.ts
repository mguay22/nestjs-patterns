import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { TemplateRegistryService } from './template-registry.service.js';

interface CloneProductDto {
  customizations?: {
    name?: string;
    price?: number;
    category?: string;
    attributes?: Record<string, unknown>;
  };
}

@Controller('prototype')
export class PrototypeController {
  constructor(private readonly registry: TemplateRegistryService) {}

  @Get('templates')
  listTemplates() {
    return this.registry.listTemplates();
  }

  @Post('products/clone/:id')
  cloneProduct(@Param('id') id: string, @Body() dto: CloneProductDto) {
    const template = this.registry.getTemplate(id);

    if (!template) {
      throw new NotFoundException(`Template with id "${id}" not found`);
    }

    const cloned = template.clone();

    if (dto.customizations) {
      if (dto.customizations.name !== undefined) {
        cloned.name = dto.customizations.name;
      }
      if (dto.customizations.price !== undefined) {
        cloned.price = dto.customizations.price;
      }
      if (dto.customizations.category !== undefined) {
        cloned.category = dto.customizations.category;
      }
      if (dto.customizations.attributes !== undefined) {
        cloned.attributes = {
          ...cloned.attributes,
          ...dto.customizations.attributes,
        };
      }
    }

    return {
      clonedFrom: id,
      product: cloned,
    };
  }
}
