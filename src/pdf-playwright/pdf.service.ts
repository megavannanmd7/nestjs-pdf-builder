/* eslint-disable*//* eslint-disable*/
import { Injectable } from '@nestjs/common';
import { BrowserProvider } from './playwright/browser.provider';
import { TrendChartService } from './charts/trend-chart.service';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { resolveTemplatePath } from './template-path.util';

@Injectable()
export class PdfService {
  constructor(
    private readonly browserProvider: BrowserProvider,
    private readonly trendChartService: TrendChartService,
  ) {}

  async generateReportPdf(data: any): Promise<Buffer> {
    // Chart
    const chartBase64 = await this.trendChartService.generateTrendChart(
      data.projectSummary.aiScoreTrend,
    );

    const cssPath = resolveTemplatePath('report.styles.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    const payload = {
      ...data,
      aiScoreTrendChart: chartBase64
    };

    const htmlTemplate = fs.readFileSync(
      resolveTemplatePath('report.template.html'),
      'utf-8'
    );

    const compiled = handlebars.compile(htmlTemplate);
    const finalHtml = compiled(payload);

    const browser = await this.browserProvider.getBrowser();
    const page = await browser.newPage();

    await page.setContent(finalHtml, { waitUntil: 'networkidle' });

    // ⭐ THIS LINE MAKES CSS WORK ⭐
    await page.addStyleTag({ content: cssContent });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '40px', bottom: '40px' },
    });

    await page.close();
    return pdf;
  }
}



    // const htmlTemplate = fs.readFileSync(
    //   path.join(__dirname, 'template', 'report.template.html'),
    //   'utf-8',
    // );