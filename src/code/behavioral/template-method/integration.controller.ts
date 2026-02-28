import { Controller, Get, Param } from '@nestjs/common';
import { ReportService } from './integration.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get(':type')
  generateReport(@Param('type') type: string) {
    return this.reportService.generateReport(type);
  }
}
