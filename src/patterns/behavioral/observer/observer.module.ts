import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ObserverController } from './observer.controller.js';
import { OrderService } from './order.service.js';
import { InventoryObserver } from './inventory.observer.js';
import { AnalyticsObserver } from './analytics.observer.js';
import { EmailObserver } from './email.observer.js';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [ObserverController],
  providers: [OrderService, InventoryObserver, AnalyticsObserver, EmailObserver],
  exports: [OrderService],
})
export class ObserverModule {}
