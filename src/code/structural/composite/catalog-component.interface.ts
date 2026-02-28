export interface CatalogComponent {
  getName(): string;
  getPrice(): number;
  getCount(): number;
  display(indent?: number): string;
}
