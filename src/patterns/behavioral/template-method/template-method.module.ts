import { Module } from '@nestjs/common';
import { TemplateMethodController } from './template-method.controller.js';

@Module({
  controllers: [TemplateMethodController],
})
export class TemplateMethodModule {}
