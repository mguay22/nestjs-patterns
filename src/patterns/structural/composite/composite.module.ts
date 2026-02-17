import { Module } from '@nestjs/common';
import { CompositeController } from './composite.controller.js';
import { CatalogService } from './catalog.service.js';

@Module({
  controllers: [CompositeController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CompositeModule {}
