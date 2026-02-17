import { CatalogComponent } from './catalog-component.interface.js';

export class Category implements CatalogComponent {
  private readonly children: CatalogComponent[] = [];

  constructor(private readonly name: string) {}

  add(child: CatalogComponent): void {
    this.children.push(child);
  }

  remove(child: CatalogComponent): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.children.reduce((sum, child) => sum + child.getPrice(), 0);
  }

  getCount(): number {
    return this.children.reduce((count, child) => count + child.getCount(), 0);
  }

  display(indent: number = 0): string {
    const padding = ' '.repeat(indent);
    const lines = [`${padding}+ ${this.name}`];

    for (const child of this.children) {
      lines.push(child.display(indent + 2));
    }

    return lines.join('\n');
  }
}
