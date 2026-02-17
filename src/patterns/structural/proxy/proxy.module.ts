import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ProductCatalogService } from './product-catalog.service';
import { CachingProxyService } from './caching-proxy.service';
import { AccessControlProxyService } from './access-control-proxy.service';

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
