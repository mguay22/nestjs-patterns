export interface ReportData {
  title: string;
  generatedAt: string;
  type: string;
  data: Record<string, any>;
  summary: Record<string, any>;
}

export abstract class ReportGenerator {
  generate(): ReportData {
    const rawData = this.gatherData();
    const processedData = this.processData(rawData);
    const report = this.formatReport(processedData);
    return report;
  }

  protected abstract gatherData(): Record<string, any>[];

  protected processData(data: Record<string, any>[]): Record<string, any> {
    return {
      records: data,
      totalRecords: data.length,
      processedAt: new Date().toISOString(),
    };
  }

  protected abstract formatReport(processedData: Record<string, any>): ReportData;
}
