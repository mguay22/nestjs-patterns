import { Module } from '@nestjs/common';
import { InterpreterController } from './interpreter.controller';
import { DiscountParserService } from './discount-parser.service';

@Module({
  controllers: [InterpreterController],
  providers: [DiscountParserService],
  exports: [DiscountParserService],
})
export class InterpreterModule {}
