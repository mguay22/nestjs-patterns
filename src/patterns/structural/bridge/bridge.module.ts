import { Module } from '@nestjs/common';
import { BridgeController } from './bridge.controller.js';

@Module({
  controllers: [BridgeController],
})
export class BridgeModule {}
