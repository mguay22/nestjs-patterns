import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { StripeAdapter } from './stripe.adapter';
import { PayPalAdapter } from './paypal.adapter';
import { PaymentGateway } from './payment-gateway.interface';

interface PaymentDto {
  gateway: 'stripe' | 'paypal';
  amount: number;
  currency: string;
}

@Controller('adapter')
export class AdapterController {
  private readonly gateways: Record<string, PaymentGateway>;

  constructor(
    private readonly stripeAdapter: StripeAdapter,
    private readonly paypalAdapter: PayPalAdapter,
  ) {
    this.gateways = {
      stripe: this.stripeAdapter,
      paypal: this.paypalAdapter,
    };
  }

  @Post('payments')
  processPayment(@Body() dto: PaymentDto) {
    const adapter = this.gateways[dto.gateway];

    if (!adapter) {
      throw new BadRequestException(
        `Unknown gateway: ${dto.gateway}. Valid gateways: stripe, paypal`,
      );
    }

    return adapter.charge(dto.amount, dto.currency);
  }
}
