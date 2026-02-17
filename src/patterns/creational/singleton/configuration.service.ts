import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ConfigurationService {
  private readonly instanceId: string;

  constructor() {
    this.instanceId = randomUUID();
  }

  getConfig() {
    return {
      instanceId: this.instanceId,
      database: 'postgres://localhost:5432/nestjs_patterns',
      cacheEnabled: true,
    };
  }
}
