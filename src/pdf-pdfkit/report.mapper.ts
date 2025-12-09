/* eslint-disable */// report.mapper.ts

export class ReportMapper {
  static toPdfDto(report: any) {
    return {
      title: report.title ?? "Weekly Project Report",
      logoUrl: report.logoUrl,
      
      // 1. Summary
      summary: report.projectSummary?.aiSummary ?? '',

      // 2. Score Data
      datapoints: (report.projectSummary?.aiScoreTrend ?? []).map((t: any) => ({
        date: t.date,
        value: t.score,
      })),
      score: report.projectSummary?.aiScore?.score,
      health: report.projectSummary?.aiScore?.health,

      // 3. ⚠️ MAP QUICK ACTIONS HERE ⚠️
      quickActions: (report.quickActions ?? [])
        .map((a: any) => `• ${a.action} — ${a.reason}`)
        .join('\n'),

      // 4. Sections (Accomplishments & Next Week ONLY)
      // Do NOT include Quick Actions here anymore
      sections: [
        {
          title: "Accomplishments",
          content: (report.accomplishments ?? [])
            .map((a: any) => `• ${a.task} | ${a.date} | ${a.impact} | ${a.owner}`)
            .join('\n'),
        },
        {
          title: "Next Week Plan",
          content: (report.nextWeekPlan ?? [])
            .map((a: any) => `• ${a.task} | ${a.dueDate} | ${a.impact} | ${a.owner}`)
            .join('\n'),
        },
      ],

      // Metadata
      projectName: report.projectName,
      projectOwner: report.projectOwner,
      reportStartDate: report.reportStartDate,
      reportEndDate: report.reportEndDate,
    };
  }
}