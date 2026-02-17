import { Injectable } from '@nestjs/common';

export interface StockCheckResult {
  available: boolean;
  unavailableItems: string[];
}

@Injectable()
export class InventoryService {
  checkStock(items: { name: string; quantity: number }[]): StockCheckResult {
    const unavailableItems: string[] = [];

    for (const item of items) {
      // Simulate stock check: items with quantity > 100 are unavailable
      if (item.quantity > 100) {
        unavailableItems.push(item.name);
      }
    }

    return {
      available: unavailableItems.length === 0,
      unavailableItems,
    };
  }
}
