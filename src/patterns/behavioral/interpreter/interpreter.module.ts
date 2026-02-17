import { Module } from '@nestjs/common';
import { InterpreterController } from './interpreter.controller.js';
import { DiscountParserService } from './discount-parser.service.js';

@Module({
  controllers: [InterpreterController],
  providers: [DiscountParserService],
  exports: [DiscountParserService],
})
export class InterpreterModule {}
