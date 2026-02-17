import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller.js';
import { ProductCatalogService } from './product-catalog.service.js';
import { CachingProxyService } from './caching-proxy.service.js';
import { AccessControlProxyService } from './access-control-proxy.service.js';

@Module({
  controllers: [ProxyController],
  providers: [
    ProductCatalogService,
    CachingProxyService,
    {
      provide: AccessControlProxyService,
      useFactory: (cachingProxy: CachingProxyService) => {
        return new AccessControlProxyService(cachingProxy);
      },
      inject: [CachingProxyService],
    },
  ],
  exports: [CachingProxyService, AccessControlProxyService],
})
export class ProxyModule {}
