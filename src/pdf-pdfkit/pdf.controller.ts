import { Controller, Post, Body, Res } from '@nestjs/common';
import { PDFService } from './pdf.service';
import { Response } from 'express';
import { ReportMapper } from './report.mapper';

@Controller('pdf-pdfkit')
export class PdfController {
  constructor(private readonly pdfService: PDFService) {}

  @Post('generate')
  async generatePdf(@Body() report: any, @Res() res: Response) {
    const dto = ReportMapper.toPdfDto(report);
    const buffer = await this.pdfService.makePdf(dto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=report.pdf',
    });

    return res.send(buffer);
  }
}
