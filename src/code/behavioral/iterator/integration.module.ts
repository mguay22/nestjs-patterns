import { Module } from '@nestjs/common';
import { ProductController } from './integration.controller';
import { ProductService } from './integration.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class IteratorModule {}
