import { Module } from '@nestjs/common';
import { FacadeController } from './facade.controller';
import { InventoryService } from './inventory.service';
import { PaymentService } from './payment.service';
import { ShippingService } from './shipping.service';
import { NotificationService } from './notification.service';
import { OrderFacadeService } from './order-facade.service';

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
