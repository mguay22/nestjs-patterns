import { Controller, Get } from '@nestjs/common';
import { ConfigurationService } from './configuration.service.js';

@Controller('singleton')
export class SingletonController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  getRoute1() {
    return {
      source: 'route1',
      config: this.configurationService.getConfig(),
    };
  }

  @Get('other')
  getRoute2() {
    return {
      source: 'route2',
      config: this.configurationService.getConfig(),
    };
  }
}
