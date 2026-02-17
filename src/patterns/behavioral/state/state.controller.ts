import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { StateService } from './state.service.js';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post('orders')
  createOrder(@Body() body?: { id?: string }) {
    const order = this.stateService.createOrder(body?.id);
    return order.getStatus();
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    const order = this.stateService.getOrder(id);
    return order.getStatus();
  }

  @Post('orders/:id/:action')
  transition(@Param('id') id: string, @Param('action') action: string) {
    const result = this.stateService.transition(id, action);
    const order = this.stateService.getOrder(id);

    return {
      ...result,
      order: order.getStatus(),
    };
  }
}
