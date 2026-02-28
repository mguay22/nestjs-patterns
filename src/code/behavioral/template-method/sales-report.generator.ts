import { ReportGenerator, ReportData } from './report-generator';

export class SalesReportGenerator extends ReportGenerator {
  protected gatherData(): Record<string, any>[] {
    return [
      { orderId: 'ORD001', product: 'Laptop', amount: 999.99, date: '2026-02-01', region: 'North' },
      { orderId: 'ORD002', product: 'Headphones', amount: 49.99, date: '2026-02-03', region: 'South' },
      { orderId: 'ORD003', product: 'Tablet', amount: 449.99, date: '2026-02-05', region: 'North' },
      { orderId: 'ORD004', product: 'Smartphone', amount: 699.99, date: '2026-02-07', region: 'East' },
      { orderId: 'ORD005', product: 'Monitor', amount: 349.99, date: '2026-02-10', region: 'West' },
      { orderId: 'ORD006', product: 'Keyboard', amount: 79.99, date: '2026-02-12', region: 'North' },
    ];
  }

  protected formatReport(processedData: Record<string, any>): ReportData {
    const records = processedData.records as Record<string, any>[];
    const totalRevenue = records.reduce((sum, r) => sum + r.amount, 0);
    const avgOrderValue = totalRevenue / records.length;

    const byRegion: Record<string, number> = {};
    for (const record of records) {
      byRegion[record.region] = (byRegion[record.region] ?? 0) + record.amount;
    }

    return {
      title: 'Sales Report',
      generatedAt: new Date().toISOString(),
      type: 'sales',
      data: processedData,
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averageOrderValue: Math.round(avgOrderValue * 100) / 100,
        totalOrders: records.length,
        revenueByRegion: byRegion,
      },
    };
  }
}
