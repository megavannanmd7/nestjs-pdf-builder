// src/pdf/pdf.module.ts
import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { BrowserProvider } from './playwright/browser.provider';
import { TrendChartService } from './charts/trend-chart.service';

@Module({
  controllers: [PdfController],
  providers: [PdfService, BrowserProvider, TrendChartService],
  exports: [PdfService],
})
export class PdfPlaywrightModule {}
