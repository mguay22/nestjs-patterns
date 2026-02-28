import { Module } from '@nestjs/common';
import { CatalogController } from './integration.controller';
import { CatalogAccessService } from './integration.service';
import { ProductCatalogService } from './product-catalog.service';
import { CachingProxyService } from './caching-proxy.service';
import { AccessControlProxyService } from './access-control-proxy.service';

@Module({
  controllers: [CatalogController],
  providers: [
    CatalogAccessService,
    ProductCatalogService,
    CachingProxyService,
    {
      provide: AccessControlProxyService,
      useFactory: (cachingProxy: CachingProxyService) =>
        new AccessControlProxyService(cachingProxy),
      inject: [CachingProxyService],
    },
  ],
})
export class ProxyModule {}
