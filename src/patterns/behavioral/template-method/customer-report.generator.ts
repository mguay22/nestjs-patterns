import { ReportGenerator, ReportData } from './report-generator.js';

export class CustomerReportGenerator extends ReportGenerator {
  protected gatherData(): Record<string, any>[] {
    return [
      { customerId: 'C001', name: 'Alice Johnson', totalSpent: 2499.97, orderCount: 5, tier: 'gold', joinDate: '2024-03-15' },
      { customerId: 'C002', name: 'Bob Smith', totalSpent: 149.98, orderCount: 2, tier: 'bronze', joinDate: '2025-08-20' },
      { customerId: 'C003', name: 'Carol Williams', totalSpent: 5899.94, orderCount: 12, tier: 'platinum', joinDate: '2023-01-10' },
      { customerId: 'C004', name: 'David Brown', totalSpent: 799.99, orderCount: 3, tier: 'silver', joinDate: '2025-01-05' },
      { customerId: 'C005', name: 'Eve Davis', totalSpent: 3249.95, orderCount: 8, tier: 'gold', joinDate: '2024-06-22' },
    ];
  }

  protected formatReport(processedData: Record<string, any>): ReportData {
    const records = processedData.records as Record<string, any>[];
    const totalRevenue = records.reduce((sum, r) => sum + r.totalSpent, 0);
    const avgSpendPerCustomer = totalRevenue / records.length;
    const totalOrders = records.reduce((sum, r) => sum + r.orderCount, 0);

    const byTier: Record<string, number> = {};
    for (const record of records) {
      byTier[record.tier] = (byTier[record.tier] ?? 0) + 1;
    }

    const topCustomers = [...records]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 3)
      .map((c) => ({ name: c.name, totalSpent: c.totalSpent, tier: c.tier }));

    return {
      title: 'Customer Report',
      generatedAt: new Date().toISOString(),
      type: 'customer',
      data: processedData,
      summary: {
        totalCustomers: records.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averageSpendPerCustomer: Math.round(avgSpendPerCustomer * 100) / 100,
        totalOrders,
        customersByTier: byTier,
        topCustomers,
      },
    };
  }
}
