export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface ProductCatalog {
  getProduct(id: string): Product | null;
  listProducts(): Product[];
}
