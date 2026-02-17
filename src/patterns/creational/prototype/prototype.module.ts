import { Module } from '@nestjs/common';
import { PrototypeController } from './prototype.controller';
import { TemplateRegistryService } from './template-registry.service';

@Module({
  controllers: [PrototypeController],
  providers: [TemplateRegistryService],
  exports: [TemplateRegistryService],
})
export class PrototypeModule {}
