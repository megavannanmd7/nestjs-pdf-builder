import { Injectable } from '@nestjs/common';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';

@Injectable()
export class TrendChartService {
  private chart: ChartJSNodeCanvas;

  constructor() {
    this.chart = new ChartJSNodeCanvas({
      width: 800,
      height: 350,
      backgroundColour: 'white',
    });
  }

  async generateTrendChart(
    trend: Array<{ date: string; score: number }>,
  ): Promise<string> {
    const labels = trend.map((t) => t.date);
    const scores = trend.map((t) => t.score);

    const configuration: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'AI Score Trend',
            data: scores,
            borderColor: '#4A90E2',
            borderWidth: 3,
            fill: false,
            tension: 0.2,
            pointRadius: 4,
            pointBackgroundColor: '#4A90E2',
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            min: 0,
            max: 100,
            ticks: { stepSize: 10 },
          },
        },
      },
    };

    const buffer = await this.chart.renderToBuffer(configuration);
    return buffer.toString('base64');
  }
}
