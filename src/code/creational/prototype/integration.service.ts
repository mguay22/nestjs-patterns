import { Injectable } from '@nestjs/common';
import { TemplateRegistryService } from './template-registry.service';

@Injectable()
export class ProductTemplateService {
  constructor(private readonly registry: TemplateRegistryService) {}

  listTemplates() {
    return this.registry.listTemplates();
  }

  createFromTemplate(id: string) {
    const template = this.registry.getTemplate(id);
    return template?.clone();
  }
}
