import { Module } from '@nestjs/common';
import { TemplateMethodController } from './template-method.controller';

@Module({
  controllers: [TemplateMethodController],
})
export class TemplateMethodModule {}
