import { Module } from '@nestjs/common';
import { OrderController } from './integration.controller';
import { OrderStateService } from './integration.service';
import { StateService } from './state.service';

@Module({
  controllers: [OrderController],
  providers: [OrderStateService, StateService],
  exports: [StateService],
})
export class StateModule {}
