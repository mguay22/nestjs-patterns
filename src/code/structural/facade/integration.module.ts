import { Module } from '@nestjs/common';
import { OrderController } from './integration.controller';
import { OrderPlacementService } from './integration.service';
import { InventoryService } from './inventory.service';
import { PaymentService } from './payment.service';
import { ShippingService } from './shipping.service';
import { NotificationService } from './notification.service';
import { OrderFacadeService } from './order-facade.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrderPlacementService,
    InventoryService,
    PaymentService,
    ShippingService,
    NotificationService,
    OrderFacadeService,
  ],
  exports: [OrderFacadeService],
})
export class FacadeModule {}
