import { Injectable } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigurationService) {}

  getConfig() {
    return this.configService.getConfig();
  }
}
