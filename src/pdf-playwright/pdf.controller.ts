import { Controller, Post, Body, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';

@Controller('pdf-playwright')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  async generate(@Body() body: any, @Res() res: Response) {
    const buffer = await this.pdfService.generateReportPdf(body);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="report.pdf"',
    });

    res.send(buffer);
  }
}
