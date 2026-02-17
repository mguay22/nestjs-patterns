import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { StripeFactory } from './stripe/stripe.factory';
import { PaypalFactory } from './paypal/paypal.factory';
import { PaymentFactory } from './payment-factory.interface';

interface CheckoutDto {
  provider: 'stripe' | 'paypal';
  amount: number;
}

@Controller('abstract-factory')
export class AbstractFactoryController {
  private readonly factories: Record<string, PaymentFactory>;

  constructor(
    private readonly stripeFactory: StripeFactory,
    private readonly paypalFactory: PaypalFactory,
  ) {
    this.factories = {
      stripe: this.stripeFactory,
      paypal: this.paypalFactory,
    };
  }

  @Post('checkout')
  checkout(@Body() dto: CheckoutDto) {
    const factory = this.factories[dto.provider];

    if (!factory) {
      throw new BadRequestException(
        `Unknown payment provider: ${dto.provider}. Valid providers: stripe, paypal`,
      );
    }

    const processor = factory.createPaymentProcessor();
    const result = processor.processPayment(dto.amount);

    return {
      payment: result,
      refundHandler: 'available',
      provider: dto.provider,
    };
  }
}
