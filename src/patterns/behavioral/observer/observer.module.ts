import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ObserverController } from './observer.controller';
import { OrderService } from './order.service';
import { InventoryObserver } from './inventory.observer';
import { AnalyticsObserver } from './analytics.observer';
import { EmailObserver } from './email.observer';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [ObserverController],
  providers: [OrderService, InventoryObserver, AnalyticsObserver, EmailObserver],
  exports: [OrderService],
})
export class ObserverModule {}
