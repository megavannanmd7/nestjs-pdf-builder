/* eslint-disable */
import PDFKit from 'pdfkit';
import { PdfStyles } from './pdf.styles';
import sizeOf from 'image-size';

export class PdfSections {

  static renderTitle(doc: PDFKit.PDFDocument, title: string) {
    doc.fontSize(PdfStyles.title.fontSize)
      .text(title, { align: 'center' });
    doc.moveDown(0.5);
  }

  static renderSubtitle(doc: PDFKit.PDFDocument, subtitle: string) {
    doc.fontSize(PdfStyles.subtitle.fontSize)
      .fillColor('#666')
      .text(subtitle, { align: 'center' });
    doc.fillColor('#000');
    doc.moveDown(1.2);
  }

  static renderHeaderBlock(doc: PDFKit.PDFDocument, model: any) {
    const y = doc.y;

    doc.fontSize(11);
    const leftX = doc.page.margins.left;
    const rightX = doc.page.width - doc.page.margins.right - 180;

    doc.text(`Project Name: ${model.projectName ?? ''}`, leftX, y);
    doc.text(`Project Owner: ${model.projectOwner ?? ''}`, leftX, doc.y + 4);

    doc.text(`Report Start Date: ${model.reportStartDate ?? ''}`, rightX, y);
    doc.text(`Report End Date: ${model.reportEndDate ?? ''}`, rightX, doc.y + 4);

    doc.moveDown(1.5);
  }

  /**
   * Renders a smaller sub-header (e.g., for "Quick Actions" inside Summary)
   */
  static renderSubHeader(doc: PDFKit.PDFDocument, title: string) {
    doc.x = doc.page.margins.left; // Force alignment
    doc.fontSize(12) // Slightly smaller than main Section Title (usually 14 or 16)
       .font('Helvetica-Bold') // Standard bold font
       .fillColor('#333')
       .text(title);
    
    // Reset font for body text
    doc.font('Helvetica').fillColor('black'); 
    doc.moveDown(0.5);
  }

  static renderScoreAndChart(doc: PDFKit.PDFDocument, health: string, score: number, chart: Buffer | null) {
    // 1. Render Title for the Chart Section
    this.renderSubHeader(doc, 'AI Score Trend');

    const y = doc.y;
    const x = doc.page.margins.left;

    // SCORE CARD
    const cardWidth = 130, cardHeight = 95;

    doc.save();
    doc.roundedRect(x, y, cardWidth, cardHeight, 8).fill('#EAFBEA');
    doc.fillColor('#0E8F3B').fontSize(11).text(health ?? '', x + 12, y + 10);
    doc.fillColor('#000').fontSize(30).text(String(score ?? ''), x + 12, y + 34);
    doc.fontSize(12).text('AI Score', x + 12, y + 68);
    doc.restore();

    // CHART
    if (chart) {
      const chartX = x + cardWidth + 35;
      const chartDims = sizeOf(chart);
      const aspect = chartDims.height / chartDims.width;

      const chartWidth = 360;
      const chartHeight = chartWidth * aspect;

      doc.image(chart, chartX, y, { width: chartWidth, height: chartHeight });
    }

    // Move cursor down past the chart/card height
    // chartHeight is usually around 100-120 depending on aspect ratio
    doc.y = y + 120; 
    doc.moveDown(1.5); // Add spacing before the next section (Quick Actions)
  }

  static renderSection(doc: PDFKit.PDFDocument, title: string, content: string) {
  doc.x = doc.page.margins.left; // ⚠️ Safety reset
  
  doc.fontSize(PdfStyles.sectionTitle.fontSize)
    .text(title);
  doc.moveDown(0.3);

  doc.fontSize(PdfStyles.text.fontSize)
    .text(content, { align: 'justify' });

  doc.moveDown(1.0);
}

static renderSectionTitleOnly(doc: PDFKit.PDFDocument, title: string) {
  // ⚠️ ALIGNMENT FIX: Explicitly force X position to the left margin
  doc.x = doc.page.margins.left;
  
  doc.fontSize(PdfStyles.sectionTitle.fontSize)
    .text(title);
  
  doc.moveDown(0.3);
}
// pdf.sections.ts

  /**
   * Renders a table with dynamic row height, prevents orphaned headers, 
   * and keeps the section title attached to the table.
   */
  static renderTable(doc: PDFKit.PDFDocument, headers: string[], rows: string[][], title?: string) {
    const startX = doc.page.margins.left;
    let y = doc.y;
    const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colWidth = availableWidth / headers.length;
    const padding = 6;
    const headerHeight = 26;
    const verticalPadding = 7; 

    doc.lineWidth(0.5);

    // ---------------------------------------------------------
    // 1. LOOK-AHEAD: Calculate heights
    // ---------------------------------------------------------
    
    // A. Calculate Title Height (if provided)
    let titleHeight = 0;
    if (title) {
      doc.fontSize(PdfStyles.sectionTitle.fontSize);
      titleHeight = doc.heightOfString(title, { width: availableWidth }) + 10; // +10 for spacing
    }

    // B. Calculate First Row Height
    let firstRowHeight = 0;
    if (rows.length > 0) {
      doc.fontSize(10); 
      for (const cell of rows[0]) {
        const h = doc.heightOfString(cell, { width: colWidth - 2 * padding });
        firstRowHeight = Math.max(firstRowHeight, h + 2 * verticalPadding);
      }
      firstRowHeight = Math.max(firstRowHeight, 26);
    }

    // ---------------------------------------------------------
    // 2. CHECK SPACE: Does Title + Header + First Row fit?
    // ---------------------------------------------------------
    const pageHeightLimit = doc.page.height - doc.page.margins.bottom;
    const totalNeeded = titleHeight + headerHeight + firstRowHeight;
    
    // If not enough space, force NEW PAGE
    if (y + totalNeeded > pageHeightLimit) {
      doc.addPage();
      y = doc.page.margins.top;
    }

    // ---------------------------------------------------------
    // 3. RENDER TITLE (Now that we are on the correct page)
    // ---------------------------------------------------------
    if (title) {
      // Use your existing helper or render manually to ensure alignment
      this.renderSectionTitleOnly(doc, title);
      y = doc.y; // Update Y to be below the title
    }

    // ---------------------------------------------------------
    // 4. DRAW HEADER
    // ---------------------------------------------------------
    doc.save();
    doc.rect(startX, y, availableWidth, headerHeight).fill('#F2F2F2');
    doc.restore();

    headers.forEach((h, i) => {
      doc.fontSize(11).fillColor('black')
        .text(h, startX + i * colWidth + padding, y + 7, {
          width: colWidth - 2 * padding,
          align: 'left'
        });
    });

    doc.rect(startX, y, availableWidth, headerHeight).stroke();
    y += headerHeight;

    // ---------------------------------------------------------
    // 5. DRAW ROWS
    // ---------------------------------------------------------
    rows.forEach((row, idx) => {
      // Calculate Row Height
      let maxRowHeight = 0;
      doc.fontSize(10); 

      for (const cell of row) {
        const h = doc.heightOfString(cell, { width: colWidth - 2 * padding });
        maxRowHeight = Math.max(maxRowHeight, h + 2 * verticalPadding);
      }
      const rowHeight = Math.max(maxRowHeight, 26);

      // Check for Page Break (Intermediate rows)
      if (y + rowHeight > pageHeightLimit) {
        doc.addPage();
        y = doc.page.margins.top;

        // Redraw Header on new page
        doc.save();
        doc.rect(startX, y, availableWidth, headerHeight).fill('#F2F2F2');
        doc.restore();

        headers.forEach((h, i) => {
          doc.fontSize(11).fillColor('black')
            .text(h, startX + i * colWidth + padding, y + 7, {
              width: colWidth - 2 * padding,
              align: 'left'
            });
        });
        doc.rect(startX, y, availableWidth, headerHeight).stroke();
        y += headerHeight;
      }

      // Draw Row Background
      if (idx % 2 === 1) {
        doc.save();
        doc.rect(startX, y, availableWidth, rowHeight).fill('#FAFAFA');
        doc.restore();
      }
      
      // Draw Content
      doc.moveTo(startX, y).lineTo(startX + availableWidth, y).stroke();
      
      row.forEach((cell, i) => {
        doc.fontSize(10).fillColor('black')
          .text(cell, startX + i * colWidth + padding, y + verticalPadding, {
            width: colWidth - 2 * padding,
            align: 'left'
          });
        
        doc.moveTo(startX + i * colWidth, y)
           .lineTo(startX + i * colWidth, y + rowHeight).stroke();
      });

      doc.moveTo(startX + availableWidth, y)
         .lineTo(startX + availableWidth, y + rowHeight).stroke();

      y += rowHeight;
    });
    
    doc.moveTo(startX, y).lineTo(startX + availableWidth, y).stroke();
    doc.y = y + 15;
  }
}
