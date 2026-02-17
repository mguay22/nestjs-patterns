import { Module } from '@nestjs/common';
import { StateController } from './state.controller.js';
import { StateService } from './state.service.js';

@Module({
  controllers: [StateController],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}
