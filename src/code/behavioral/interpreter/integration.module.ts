import { Module } from '@nestjs/common';
import { DiscountController } from './integration.controller';
import { DiscountService } from './integration.service';
import { DiscountParserService } from './discount-parser.service';

@Module({
  controllers: [DiscountController],
  providers: [DiscountService, DiscountParserService],
  exports: [DiscountParserService],
})
export class InterpreterModule {}
