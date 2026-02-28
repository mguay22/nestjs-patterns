import { Module } from '@nestjs/common';
import { NotificationController } from './integration.controller';
import { NotificationService } from './integration.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class BridgeModule {}
