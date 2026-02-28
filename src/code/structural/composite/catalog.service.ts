import { Injectable } from '@nestjs/common';
import { Category } from './category';
import { ProductItem } from './product-item';
import { CatalogComponent } from './catalog-component.interface';

@Injectable()
export class CatalogService {
  buildCatalog(): CatalogComponent {
    const root = new Category('Store Catalog');

    // Electronics
    const electronics = new Category('Electronics');
    const phones = new Category('Phones');
    phones.add(new ProductItem('iPhone 16 Pro', 1199.99));
    phones.add(new ProductItem('Samsung Galaxy S25', 999.99));
    phones.add(new ProductItem('Google Pixel 9', 799.99));

    const laptops = new Category('Laptops');
    laptops.add(new ProductItem('MacBook Pro 16"', 2499.99));
    laptops.add(new ProductItem('Dell XPS 15', 1799.99));
    laptops.add(new ProductItem('ThinkPad X1 Carbon', 1599.99));

    electronics.add(phones);
    electronics.add(laptops);

    // Clothing
    const clothing = new Category('Clothing');
    const men = new Category('Men');
    men.add(new ProductItem('Cotton T-Shirt', 29.99));
    men.add(new ProductItem('Slim Fit Jeans', 59.99));

    const women = new Category('Women');
    women.add(new ProductItem('Summer Dress', 79.99));
    women.add(new ProductItem('Leather Jacket', 199.99));

    clothing.add(men);
    clothing.add(women);

    root.add(electronics);
    root.add(clothing);

    return root;
  }
}
