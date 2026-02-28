import { Module } from '@nestjs/common';
import { ConfigController } from './integration.controller';
import { AppConfigService } from './integration.service';
import { ConfigurationService } from './configuration.service';

@Module({
  controllers: [ConfigController],
  providers: [AppConfigService, ConfigurationService],
  exports: [ConfigurationService],
})
export class SingletonModule {}
