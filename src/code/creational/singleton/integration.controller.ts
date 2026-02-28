import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from './integration.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly appConfig: AppConfigService) {}

  @Get()
  getConfig() {
    return this.appConfig.getConfig();
  }
}
