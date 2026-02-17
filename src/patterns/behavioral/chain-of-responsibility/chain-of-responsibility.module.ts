import { Module } from '@nestjs/common';
import { ChainOfResponsibilityController } from './chain-of-responsibility.controller.js';
import { ValidationChainService } from './validation-chain.service.js';

@Module({
  controllers: [ChainOfResponsibilityController],
  providers: [ValidationChainService],
  exports: [ValidationChainService],
})
export class ChainOfResponsibilityModule {}
