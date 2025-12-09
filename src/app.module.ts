import { Module } from '@nestjs/common';
import { PdfModule } from './pdf-pdfkit/pdf.module';
import { PdfPlaywrightModule } from './pdf-playwright/pdf-playwright.module';

@Module({
  imports: [PdfModule,PdfPlaywrightModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
