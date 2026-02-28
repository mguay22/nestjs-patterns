import { Injectable } from '@nestjs/common';
import { OrderFacadeService } from './order-facade.service';
import type { PlaceOrderData } from './order-facade.service';

@Injectable()
export class OrderPlacementService {
  constructor(private readonly orderFacade: OrderFacadeService) {}

  placeOrder(orderData: PlaceOrderData) {
    return this.orderFacade.placeOrder(orderData);
  }
}
