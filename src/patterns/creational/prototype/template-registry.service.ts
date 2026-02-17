import { Injectable } from '@nestjs/common';
import { ProductTemplate } from './product-template';

@Injectable()
export class TemplateRegistryService {
  private readonly templates = new Map<string, ProductTemplate>();

  constructor() {
    this.templates.set(
      'basic-tshirt',
      new ProductTemplate('Basic T-Shirt', 19.99, 'apparel', {
        material: 'cotton',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['white', 'black', 'navy'],
        care: 'machine wash cold',
      }),
    );

    this.templates.set(
      'premium-headphones',
      new ProductTemplate('Premium Headphones', 299.99, 'electronics', {
        type: 'over-ear',
        wireless: true,
        noiseCancelling: true,
        batteryLife: '30 hours',
        driver: '40mm',
      }),
    );

    this.templates.set(
      'ebook-template',
      new ProductTemplate('E-Book Template', 9.99, 'digital', {
        format: 'PDF',
        pages: 200,
        language: 'English',
        drm: false,
        downloadable: true,
      }),
    );
  }

  getTemplate(id: string): ProductTemplate | undefined {
    return this.templates.get(id);
  }

  addTemplate(id: string, template: ProductTemplate): void {
    this.templates.set(id, template);
  }

  listTemplates(): { id: string; template: ProductTemplate }[] {
    return Array.from(this.templates.entries()).map(([id, template]) => ({
      id,
      template,
    }));
  }
}
