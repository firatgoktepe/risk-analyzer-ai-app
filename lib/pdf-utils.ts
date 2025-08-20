import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AnalysisResult } from '@/app/page';

export interface PDFGenerationOptions {
    analysisResults: AnalysisResult;
    photoName?: string;
    analysisDate?: Date;
    photoBase64?: string;
}

export async function generateSafetyAnalysisPDF({
    analysisResults,
    photoName = 'uploaded-photo',
    analysisDate = new Date(),
    photoBase64,
}: PDFGenerationOptions): Promise<void> {
    try {
        // Create a new PDF document
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin;

        // Helper function to add text with line wrapping
        const addWrappedText = (
            text: string,
            x: number,
            y: number,
            maxWidth: number,
            fontSize: number = 12,
            isBold: boolean = false
        ): number => {
            pdf.setFontSize(fontSize);
            pdf.setFont('helvetica', isBold ? 'bold' : 'normal');

            const lines = pdf.splitTextToSize(text, maxWidth);
            const lineHeight = fontSize * 0.4;

            lines.forEach((line: string, index: number) => {
                pdf.text(line, x, y + (index * lineHeight));
            });

            return y + (lines.length * lineHeight) + 5;
        };

        // Helper function to check if we need a new page
        const checkNewPage = (requiredSpace: number): void => {
            if (yPosition + requiredSpace > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
            }
        };

        // Title
        pdf.setFillColor(37, 99, 235); // Blue color
        pdf.rect(0, 0, pageWidth, 40, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Work Safety Analysis Report', pageWidth / 2, 25, { align: 'center' });

        yPosition = 50;

        // Document info section
        pdf.setTextColor(0, 0, 0);
        pdf.setFillColor(248, 250, 252); // Light gray background
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F');

        yPosition += 8;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Analysis Details', margin + 5, yPosition);

        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Photo: ${photoName}`, margin + 5, yPosition);

        yPosition += 6;
        pdf.text(`Analysis Date: ${analysisDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, margin + 5, yPosition);

        yPosition += 6;
        pdf.text(`Total Risks Identified: ${analysisResults.risks.length}`, margin + 5, yPosition);

        yPosition += 20;

        // Photo section (if photo is provided)
        if (photoBase64) {
            checkNewPage(80);

            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            yPosition = addWrappedText('Analyzed Photo', margin, yPosition, pageWidth - 2 * margin, 16, true);
            yPosition += 5;

            try {
                // Calculate image dimensions to fit within page while maintaining aspect ratio
                const maxImageWidth = pageWidth - 2 * margin;
                const maxImageHeight = 60; // Maximum height for the image in mm

                // Add the image to the PDF
                pdf.addImage(
                    photoBase64,
                    'JPEG',
                    margin,
                    yPosition,
                    maxImageWidth,
                    maxImageHeight,
                    undefined,
                    'FAST'
                );

                yPosition += maxImageHeight + 15;
            } catch (error) {
                console.error('Error adding image to PDF:', error);
                // If image fails to load, add a placeholder text
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'italic');
                pdf.setTextColor(100, 100, 100);
                yPosition = addWrappedText('Photo could not be embedded in this report.', margin, yPosition, pageWidth - 2 * margin, 11);
                pdf.setTextColor(0, 0, 0); // Reset color
                yPosition += 10;
            }
        }

        // Summary section
        checkNewPage(40);

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        yPosition = addWrappedText('Executive Summary', margin, yPosition, pageWidth - 2 * margin, 16, true);

        // Risk level counts
        const riskCounts = {
            high: analysisResults.risks.filter(r => r.level === 'high').length,
            medium: analysisResults.risks.filter(r => r.level === 'medium').length,
            low: analysisResults.risks.filter(r => r.level === 'low').length,
        };

        const summaryText = `This safety analysis identified ${analysisResults.risks.length} potential risk${analysisResults.risks.length !== 1 ? 's' : ''} in the workplace photo:

• ${riskCounts.high} High Risk issue${riskCounts.high !== 1 ? 's' : ''} (immediate attention required)
• ${riskCounts.medium} Medium Risk issue${riskCounts.medium !== 1 ? 's' : ''} (should be addressed soon)
• ${riskCounts.low} Low Risk issue${riskCounts.low !== 1 ? 's' : ''} (monitoring recommended)

${riskCounts.high > 0 ? 'URGENT: High-risk issues require immediate action to prevent potential accidents or injuries.' : 'Good news: No high-risk issues were identified in this analysis.'}`;

        yPosition = addWrappedText(summaryText, margin, yPosition, pageWidth - 2 * margin, 11);
        yPosition += 10;

        // Detailed risks section
        if (analysisResults.risks.length > 0) {
            checkNewPage(40);

            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            yPosition = addWrappedText('Detailed Risk Analysis', margin, yPosition, pageWidth - 2 * margin, 16, true);
            yPosition += 5;

            analysisResults.risks.forEach((risk, index) => {
                checkNewPage(60);

                // Risk item background
                const riskColors = {
                    high: { bg: [254, 242, 242], text: [185, 28, 28] }, // Red
                    medium: { bg: [255, 251, 235], text: [217, 119, 6] }, // Orange
                    low: { bg: [240, 253, 244], text: [22, 163, 74] }, // Green
                };

                const colors = riskColors[risk.level];

                // Risk header background
                pdf.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
                pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 15, 'F');

                // Risk number and level
                pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`Risk ${index + 1} - ${risk.level.toUpperCase()} PRIORITY`, margin + 5, yPosition + 5);

                yPosition += 15;

                // Risk title
                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(13);
                pdf.setFont('helvetica', 'bold');
                yPosition = addWrappedText(risk.title, margin + 5, yPosition, pageWidth - 2 * margin - 10, 13, true);

                // Risk recommendation
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'normal');
                yPosition = addWrappedText(`Recommendation: ${risk.recommendation}`, margin + 5, yPosition, pageWidth - 2 * margin - 10, 11);

                yPosition += 10;
            });
        } else {
            yPosition = addWrappedText('No safety risks were identified in this analysis. The workplace appears to meet basic safety standards based on the visible elements in the photo.', margin, yPosition, pageWidth - 2 * margin, 12);
        }

        // Footer
        checkNewPage(30);

        // Add a line separator
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);

        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Generated by Work Safety Analyzer - AI-Powered Workplace Safety Analysis', margin, pageHeight - 20);
        pdf.text(`Report generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 15);

        // Page numbers
        const pageCount = pdf.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setTextColor(100, 100, 100);
            pdf.setFontSize(9);
            pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }

        // Save the PDF
        const fileName = `safety-analysis-${photoName.replace(/\.[^/.]+$/, '')}-${analysisDate.toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF report');
    }
}

export async function generatePDFFromElement(elementId: string, filename: string = 'report.pdf'): Promise<void> {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Element with ID '${elementId}' not found`);
        }

        // Generate canvas from the HTML element
        const canvas = await html2canvas(element, {
            scale: 2, // Higher quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');

        // Calculate PDF dimensions
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const pdf = new jsPDF('portrait', 'mm', 'a4');
        let position = 0;

        // Add the image to PDF, handling multiple pages if needed
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(filename);
    } catch (error) {
        console.error('Error generating PDF from element:', error);
        throw new Error('Failed to generate PDF from element');
    }
}
