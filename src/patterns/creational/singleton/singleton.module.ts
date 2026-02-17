import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service.js';
import { SingletonController } from './singleton.controller.js';

@Module({
  controllers: [SingletonController],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class SingletonModule {}
