import { Injectable } from '@nestjs/common';
import { StateService } from './state.service';

@Injectable()
export class OrderStateService {
  constructor(private readonly stateService: StateService) {}

  createOrder() {
    const order = this.stateService.createOrder();
    return { orderId: order.orderId, state: order.getStateName() };
  }

  getOrder(id: string) {
    return this.stateService.getOrder(id).getStatus();
  }

  transition(id: string, action: string) {
    return this.stateService.transition(id, action);
  }
}
