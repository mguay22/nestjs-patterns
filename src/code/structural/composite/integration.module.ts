import { Module } from '@nestjs/common';
import { CatalogController } from './integration.controller';
import { CatalogDisplayService } from './integration.service';
import { CatalogService } from './catalog.service';

@Module({
  controllers: [CatalogController],
  providers: [CatalogDisplayService, CatalogService],
  exports: [CatalogService],
})
export class CompositeModule {}
