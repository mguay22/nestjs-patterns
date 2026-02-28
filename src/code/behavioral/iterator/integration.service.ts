import { Injectable } from '@nestjs/common';
import { ProductCollection } from './product-collection';

@Injectable()
export class ProductService {
  listProducts(sort?: string, category?: string) {
    const collection = new ProductCollection();

    const iterator = category
      ? collection.createCategoryIterator(category)
      : collection.createPriceAscendingIterator();

    const results = [];
    while (iterator.hasNext()) {
      results.push(iterator.next());
    }

    return results;
  }

  listPaginated(pageSize: number) {
    const collection = new ProductCollection();
    const iterator = collection.createPaginatedIterator(pageSize);

    const pages = [];
    while (iterator.hasNext()) {
      pages.push(iterator.next());
    }

    return { pages, totalProducts: collection.getTotalCount() };
  }
}
