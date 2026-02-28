export interface Iterator<T> {
  hasNext(): boolean;
  next(): T;
  reset(): void;
}

export interface IterableCollection<T> {
  createIterator(): Iterator<T>;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}
