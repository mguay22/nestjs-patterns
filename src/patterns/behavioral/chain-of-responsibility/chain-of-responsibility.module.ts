import { Module } from '@nestjs/common';
import { ChainOfResponsibilityController } from './chain-of-responsibility.controller';
import { ValidationChainService } from './validation-chain.service';

@Module({
  controllers: [ChainOfResponsibilityController],
  providers: [ValidationChainService],
  exports: [ValidationChainService],
})
export class ChainOfResponsibilityModule {}
