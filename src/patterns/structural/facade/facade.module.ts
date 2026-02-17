import { Module } from '@nestjs/common';
import { FacadeController } from './facade.controller.js';
import { InventoryService } from './inventory.service.js';
import { PaymentService } from './payment.service.js';
import { ShippingService } from './shipping.service.js';
import { NotificationService } from './notification.service.js';
import { OrderFacadeService } from './order-facade.service.js';

@Module({
  controllers: [FacadeController],
  providers: [
    InventoryService,
    PaymentService,
    ShippingService,
    NotificationService,
    OrderFacadeService,
  ],
  exports: [OrderFacadeService],
})
export class FacadeModule {}
