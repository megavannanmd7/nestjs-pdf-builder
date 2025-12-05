/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { ChartService } from './chart/chart.service';
import { AssetService } from './asset.service';
import { PdfBuilder, PDFModel } from './builders/pdf.builder';
import { PdfRequestDto } from './dto/pdf.dto';

@Injectable()
export class PDFService {
  constructor(
    private readonly chartService: ChartService,
    private readonly assetService: AssetService,
  ) {}

  async makePdf(dto: PdfRequestDto): Promise<Buffer> {
    const logo = dto.logoUrl
      ? await this.assetService.fetchImageAsBuffer(dto.logoUrl)
      : null;

    const dates = (dto.datapoints ?? []).map(d => d.date);
    const values = (dto.datapoints ?? []).map(d => d.value);

    const chart = (dates.length && values.length)
      ? await this.chartService.generateTrendChart(dates, values)
      : null;

    const model: PDFModel = {
      title: dto.title,
      chart,
      summary: dto.summary,
      quickActions: dto.quickActions,
      sections: dto.sections ?? [],
      projectName: dto.projectName,
      projectOwner: dto.projectOwner,
      reportStartDate: dto.reportStartDate,
      reportEndDate: dto.reportEndDate,
      score: dto.score,
      health: dto.health,
    };

    return PdfBuilder.buildPdfBuffer(model);
  }
}
