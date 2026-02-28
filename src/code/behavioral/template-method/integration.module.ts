import { Module } from '@nestjs/common';
import { ReportController } from './integration.controller';
import { ReportService } from './integration.service';
import { SalesReportGenerator } from './sales-report.generator';
import { InventoryReportGenerator } from './inventory-report.generator';
import { CustomerReportGenerator } from './customer-report.generator';

@Module({
  controllers: [ReportController],
  providers: [
    ReportService,
    SalesReportGenerator,
    InventoryReportGenerator,
    CustomerReportGenerator,
  ],
  exports: [SalesReportGenerator, InventoryReportGenerator, CustomerReportGenerator],
})
export class TemplateMethodModule {}
