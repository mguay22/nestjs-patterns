import { Module } from '@nestjs/common';
import { CompositeController } from './composite.controller';
import { CatalogService } from './catalog.service';

@Module({
  controllers: [CompositeController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CompositeModule {}
