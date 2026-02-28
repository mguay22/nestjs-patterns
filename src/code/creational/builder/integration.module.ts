import { Module } from '@nestjs/common';
import { OrderController } from './integration.controller';
import { OrderBuildingService } from './integration.service';

@Module({
  controllers: [OrderController],
  providers: [OrderBuildingService],
})
export class BuilderModule {}
