import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderController } from './integration.controller';
import { OrderCreationService } from './integration.service';
import { OrderService } from './order.service';
import { InventoryObserver } from './inventory.observer';
import { AnalyticsObserver } from './analytics.observer';
import { EmailObserver } from './email.observer';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [OrderController],
  providers: [
    OrderCreationService,
    OrderService,
    InventoryObserver,
    AnalyticsObserver,
    EmailObserver,
  ],
  exports: [OrderService],
})
export class ObserverModule {}
