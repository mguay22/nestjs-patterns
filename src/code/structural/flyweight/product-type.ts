export class ProductType {
  constructor(
    public readonly typeName: string,
    public readonly description: string,
    public readonly basePrice: number,
    public readonly category: string,
  ) {}
}
