import { Injectable } from '@nestjs/common';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';

@Injectable()
export class ChartService {
  private readonly canvas = new ChartJSNodeCanvas({
    width: 900,
    height: 260,
    backgroundColour: 'white',
  });

  async generateTrendChart(dates: string[], scores: number[]): Promise<Buffer> {
    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'AI Score Trend',
            data: scores,
            borderWidth: 2,
            fill: true,
            tension: 0.2,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: false,
        animation: false,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
      },
    };

    return this.canvas.renderToBuffer(config);
  }
}
