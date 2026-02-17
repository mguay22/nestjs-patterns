import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { ReportGenerator } from './report-generator';
import { SalesReportGenerator } from './sales-report.generator';
import { InventoryReportGenerator } from './inventory-report.generator';
import { CustomerReportGenerator } from './customer-report.generator';

@Controller('template-method')
export class TemplateMethodController {
  private readonly generators: Map<string, ReportGenerator>;

  constructor() {
    this.generators = new Map<string, ReportGenerator>();
    this.generators.set('sales', new SalesReportGenerator());
    this.generators.set('inventory', new InventoryReportGenerator());
    this.generators.set('customer', new CustomerReportGenerator());
  }

  @Get('reports/:type')
  generateReport(@Param('type') type: string) {
    const generator = this.generators.get(type);

    if (!generator) {
      throw new BadRequestException(
        `Unknown report type "${type}". Valid types: sales, inventory, customer`,
      );
    }

    return generator.generate();
  }
}
