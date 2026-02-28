import { Module } from '@nestjs/common';
import { OrderController } from './integration.controller';
import { OrderValidationService } from './integration.service';
import { ValidationChainService } from './validation-chain.service';

@Module({
  controllers: [OrderController],
  providers: [OrderValidationService, ValidationChainService],
  exports: [ValidationChainService],
})
export class ChainOfResponsibilityModule {}
