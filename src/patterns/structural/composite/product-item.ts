import { CatalogComponent } from './catalog-component.interface';

export class ProductItem implements CatalogComponent {
  constructor(
    private readonly name: string,
    private readonly price: number,
  ) {}

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  getCount(): number {
    return 1;
  }

  display(indent: number = 0): string {
    const padding = ' '.repeat(indent);
    return `${padding}- ${this.name} ($${this.price.toFixed(2)})`;
  }
}
