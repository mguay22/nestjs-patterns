import { Injectable } from '@nestjs/common';
import { ValidationChainService } from './validation-chain.service';
import type { OrderData } from './order-validator.interface';

@Injectable()
export class OrderValidationService {
  constructor(private readonly validationChain: ValidationChainService) {}

  async validate(order: OrderData) {
    return this.validationChain.validate(order);
  }
}
