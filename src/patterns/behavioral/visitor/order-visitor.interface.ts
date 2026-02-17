export interface OrderVisitor {
  visitPhysicalItem(item: { name: string; price: number; quantity: number; weight?: number }): number;
  visitDigitalItem(item: { name: string; price: number; quantity: number }): number;
  visitSubscriptionItem(item: { name: string; price: number; quantity: number }): number;
}
