import { Controller, Get, Param } from '@nestjs/common';
import { PaymentService } from './integration.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get(':gateway/process')
  processPayment(@Param('gateway') gateway: string) {
    return this.paymentService.processPayment(gateway);
  }

  @Get(':gateway/refund')
  processRefund(@Param('gateway') gateway: string) {
    return this.paymentService.processRefund(gateway);
  }
}
