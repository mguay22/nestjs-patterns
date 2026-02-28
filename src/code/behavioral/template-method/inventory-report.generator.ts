import { ReportGenerator, ReportData } from './report-generator';

export class InventoryReportGenerator extends ReportGenerator {
  protected gatherData(): Record<string, any>[] {
    return [
      { sku: 'SKU001', name: 'Laptop', stock: 45, reorderLevel: 10, category: 'electronics', unitCost: 650 },
      { sku: 'SKU002', name: 'Headphones', stock: 120, reorderLevel: 30, category: 'electronics', unitCost: 25 },
      { sku: 'SKU003', name: 'Running Shoes', stock: 8, reorderLevel: 15, category: 'sports', unitCost: 45 },
      { sku: 'SKU004', name: 'Novel', stock: 200, reorderLevel: 50, category: 'books', unitCost: 5 },
      { sku: 'SKU005', name: 'Tablet', stock: 3, reorderLevel: 10, category: 'electronics', unitCost: 300 },
      { sku: 'SKU006', name: 'Yoga Mat', stock: 75, reorderLevel: 20, category: 'sports', unitCost: 12 },
    ];
  }

  protected formatReport(processedData: Record<string, any>): ReportData {
    const records = processedData.records as Record<string, any>[];
    const lowStockItems = records.filter((r) => r.stock < r.reorderLevel);
    const totalInventoryValue = records.reduce((sum, r) => sum + r.stock * r.unitCost, 0);

    const byCategory: Record<string, number> = {};
    for (const record of records) {
      byCategory[record.category] = (byCategory[record.category] ?? 0) + record.stock;
    }

    return {
      title: 'Inventory Report',
      generatedAt: new Date().toISOString(),
      type: 'inventory',
      data: processedData,
      summary: {
        totalProducts: records.length,
        totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
        lowStockItems: lowStockItems.map((i) => ({ sku: i.sku, name: i.name, stock: i.stock, reorderLevel: i.reorderLevel })),
        stockByCategory: byCategory,
      },
    };
  }
}
