# NestJS PDF Report Engine

POC done for report generation for a Paxi product.  
This service generates professional PDF reports using **NestJS**, **PDFKit**, **Playwright** and **Chart.js**.

---

## 🚀 Features (Short)
- Generate project reports as PDFs  
- AI scorecard + trend chart  
- Summary and structured sections  
- Accomplishments + Next Week tables  
- Accepts JSON and returns a downloadable PDF  

---

## 🔧 Usage

```bash
npm install
npm run start

Endpoint
POST /pdf-pdfkit/generate
POST /pdf-playwright/generate
Content-Type: application/json

Body
{
  "title": "Weekly Project Report",
  "projectName": "MRO CDMP",
  "projectOwner": "Akshaya Arunkumar",
  "reportStartDate": "Dec 1, 2024",
  "reportEndDate": "Dec 14, 2024",

  "projectSummary": {
    "aiSummary": "The team progressed steadily across API stabilization, UI integration, and backlog grooming. A few dependencies caused mild delays, but overall the project remains on track with good momentum.",
    "aiScore": {
      "score": 78,
      "health": "On Track"
    },
    "aiScoreTrend": [
      { "date": "2024-12-04", "score": 75 },
      { "date": "2024-12-05", "score": 77 },
      { "date": "2024-12-06", "score": 78 }
    ],
    "trendExplanation": "The gradual upward trend reflects reduction in blockers and increased velocity in backend deliverables."
  },

  "quickActions": [
    {
      "action": "Engage with Infra team to finalize sandbox environment readiness.",
      "reason": "Critical for enabling end-to-end testing next sprint."
    },
    {
      "action": "Prioritize defect triage for API contract mismatches.",
      "reason": "Reduces QA noise and accelerates UI integration."
    }
  ],

  "accomplishments": [
    {
      "task": "Closed Jira ticket CDMP-1423: API Contract Alignment for Vendor Module",
      "date": "2024-12-03",
      "impact": "Unblocked UI team and reduced cross-team dependency delays.",
      "owner": "Harish"
    },
    {
      "task": "Integrated Purchase Order workflow with updated schema",
      "date": "2024-12-05",
      "impact": "Major milestone enabling E2E flow coverage.",
      "owner": "Lakshmi"
    },
    {
      "task": "Completed Testing for Inventory Adjustment API",
      "date": "2024-12-06",
      "impact": "Increased test coverage and improved release readiness.",
      "owner": "Rohit"
    }
  ],

  "nextWeekPlan": [
    {
      "task": "Implement Supplier Mapping UI + API integration",
      "dueDate": "2024-12-18",
      "impact": "Required for completing the Supplier module for UAT.",
      "owner": "Karthik"
    },
    {
      "task": "Finalize validation rules for PO Amendment workflow",
      "dueDate": "2024-12-19",
      "impact": "Prevents downstream defects and data quality issues.",
      "owner": "Priya"
    },
    {
      "task": "Trigger batch reconciliation testing",
      "dueDate": "2024-12-20",
      "impact": "Essential step for operational readiness and error monitoring.",
      "owner": "Rohit"
    }
  ],

  "metadata": {
    "version": "1.0",
    "generatedBy": "Paxi AI",
    "generatedAt": "2024-12-14T10:30:00Z"
  }
}