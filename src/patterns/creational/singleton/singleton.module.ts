import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { SingletonController } from './singleton.controller';

@Module({
  controllers: [SingletonController],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class SingletonModule {}
