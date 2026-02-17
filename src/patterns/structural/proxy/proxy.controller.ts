import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CachingProxyService } from './caching-proxy.service.js';
import { AccessControlProxyService } from './access-control-proxy.service.js';

@Controller('proxy')
export class ProxyController {
  constructor(
    private readonly cachingProxy: CachingProxyService,
    private readonly accessControlProxy: AccessControlProxyService,
  ) {}

  @Get('products/:id')
  getProduct(
    @Param('id') id: string,
    @Query('role') role: string = 'user',
    @Query('cache') cache: string = 'true',
  ) {
    // First, check access control
    this.accessControlProxy.getProduct(id, role);

    const useCache = cache === 'true';
    const wasCached = useCache && this.cachingProxy.isCached(id);
    const start = Date.now();

    let product;
    if (useCache) {
      product = this.cachingProxy.getProduct(id);
    } else {
      product = this.cachingProxy['realCatalog'].getProduct(id);
    }

    const duration = Date.now() - start;

    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    return {
      product,
      meta: {
        role,
        cacheEnabled: useCache,
        servedFromCache: wasCached,
        responseTimeMs: duration,
        cacheSize: this.cachingProxy.getCacheSize(),
      },
    };
  }

  @Get('products')
  listProducts(
    @Query('role') role: string = 'user',
    @Query('cache') cache: string = 'true',
  ) {
    // Check access control
    this.accessControlProxy.listProducts(role);

    const useCache = cache === 'true';

    let products;
    if (useCache) {
      products = this.cachingProxy.listProducts();
    } else {
      products = this.cachingProxy['realCatalog'].listProducts();
    }

    return {
      products,
      meta: {
        role,
        cacheEnabled: useCache,
        totalProducts: products.length,
      },
    };
  }
}
