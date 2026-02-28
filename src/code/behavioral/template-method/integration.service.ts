import { Injectable, BadRequestException } from '@nestjs/common';
import { SalesReportGenerator } from './sales-report.generator';
import { InventoryReportGenerator } from './inventory-report.generator';
import { CustomerReportGenerator } from './customer-report.generator';
import type { ReportGenerator } from './report-generator';

@Injectable()
export class ReportService {
  private readonly generators: Record<string, ReportGenerator>;

  constructor(
    salesReport: SalesReportGenerator,
    inventoryReport: InventoryReportGenerator,
    customerReport: CustomerReportGenerator,
  ) {
    this.generators = {
      sales: salesReport,
      inventory: inventoryReport,
      customer: customerReport,
    };
  }

  generateReport(type: string) {
    const generator = this.generators[type];
    if (!generator) {
      throw new BadRequestException(
        `Unknown report type: ${type}. Available: ${Object.keys(this.generators).join(', ')}`,
      );
    }
    return generator.generate();
  }
}
