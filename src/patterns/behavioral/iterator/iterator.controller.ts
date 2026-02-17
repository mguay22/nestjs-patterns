import { Controller, Get, Query } from '@nestjs/common';
import { ProductCollection } from './product-collection';
import { Product } from './iterator.interface';

@Controller('iterator')
export class IteratorController {
  private readonly collection: ProductCollection;

  constructor() {
    this.collection = new ProductCollection();
  }

  @Get('products')
  getProducts(
    @Query('sort') sort?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    // Paginated iterator
    if (page && pageSize) {
      const size = parseInt(pageSize, 10) || 5;
      const pageNum = parseInt(page, 10) || 1;
      const iterator = this.collection.createPaginatedIterator(size);

      let currentPage = 0;
      let items: Product[] = [];

      while (iterator.hasNext()) {
        const pageItems = iterator.next();
        currentPage++;
        if (currentPage === pageNum) {
          items = pageItems;
          break;
        }
      }

      return {
        items,
        iteratorType: 'paginated',
        totalItems: this.collection.getTotalCount(),
        page: pageNum,
        pageSize: size,
        totalPages: Math.ceil(this.collection.getTotalCount() / size),
      };
    }

    // Category iterator
    if (category) {
      const iterator = this.collection.createCategoryIterator(category);
      const items: Product[] = [];

      while (iterator.hasNext()) {
        items.push(iterator.next());
      }

      return {
        items,
        iteratorType: 'category',
        totalItems: items.length,
        category,
      };
    }

    // Price ascending iterator (default, or when sort=price)
    if (sort === 'price' || !sort) {
      const iterator = this.collection.createPriceAscendingIterator();
      const items: Product[] = [];

      while (iterator.hasNext()) {
        items.push(iterator.next());
      }

      return {
        items,
        iteratorType: sort === 'price' ? 'priceAscending' : 'default',
        totalItems: items.length,
      };
    }

    // Fallback: return all
    return {
      items: this.collection.getAll(),
      iteratorType: 'default',
      totalItems: this.collection.getTotalCount(),
    };
  }
}
