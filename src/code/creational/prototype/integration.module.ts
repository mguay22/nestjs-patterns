import { Module } from '@nestjs/common';
import { ProductController } from './integration.controller';
import { ProductTemplateService } from './integration.service';
import { TemplateRegistryService } from './template-registry.service';

@Module({
  controllers: [ProductController],
  providers: [ProductTemplateService, TemplateRegistryService],
  exports: [TemplateRegistryService],
})
export class PrototypeModule {}
