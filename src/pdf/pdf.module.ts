import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PDFService } from './pdf.service';
import { ChartService } from './chart/chart.service';
import { AssetService } from './asset.service';

@Module({
  controllers: [PdfController],
  providers: [PDFService, ChartService, AssetService],
})
export class PdfModule {}
