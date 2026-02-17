import { Module } from '@nestjs/common';
import { PrototypeController } from './prototype.controller.js';
import { TemplateRegistryService } from './template-registry.service.js';

@Module({
  controllers: [PrototypeController],
  providers: [TemplateRegistryService],
  exports: [TemplateRegistryService],
})
export class PrototypeModule {}
