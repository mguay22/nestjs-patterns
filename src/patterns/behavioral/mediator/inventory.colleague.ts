import { Colleague } from './colleague.interface';

export class InventoryColleague extends Colleague {
  getName(): string {
    return 'Inventory';
  }

  reserveItems(items: { name: string; qty: number }[]): {
    success: boolean;
    reserved: { name: string; qty: number }[];
    message: string;
  } {
    const reserved = items.map((item) => ({
      name: item.name,
      qty: item.qty,
    }));

    const result = {
      success: true,
      reserved,
      message: `Reserved ${reserved.length} item(s) in inventory`,
    };

    this.mediator.notify(this.getName(), 'inventory.reserved', result);

    return result;
  }

  releaseItems(items: { name: string; qty: number }[]): {
    success: boolean;
    message: string;
  } {
    return {
      success: true,
      message: `Released ${items.length} item(s) back to inventory`,
    };
  }
}
