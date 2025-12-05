export class PdfRequestDto {
  title!: string;
  logoUrl?: string;
  summary!: string;
  quickActions?: string;

  datapoints!: Array<{ date: string; value: number }>;

  sections!: Array<{ title: string; content: string }>;

  // Additional metadata
  projectName?: string;
  projectOwner?: string;
  reportStartDate?: string;
  reportEndDate?: string;

  score?: number;
  health?: string;
}
