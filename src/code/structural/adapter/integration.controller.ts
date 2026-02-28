import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaymentGatewayService } from './integration.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentGateway: PaymentGatewayService) {}

  @Get(':gateway/charge')
  charge(
    @Param('gateway') gateway: string,
    @Query('amount') amount: string,
  ) {
    return this.paymentGateway.charge(gateway, parseFloat(amount));
  }
}
