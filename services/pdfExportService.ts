import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Course, CalculationResult, HistoryEntry } from '../types';

export const exportGpaReportAsPdf = (
  courses: Course[],
  calculationResult: CalculationResult,
  history: HistoryEntry[],
  studentName?: string
) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(30, 58, 138); // blue-900
  doc.text('ScholarGPA Academic Report', 14, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);
  if (studentName) {
    doc.text(`Student: ${studentName}`, 14, 38);
  }

  // Summary Section
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('GPA Summary', 14, 50);

  autoTable(doc, {
    startY: 55,
    head: [['Metric', 'Value']],
    body: [
      ['Current Term Unweighted', calculationResult.unweightedGPA.toFixed(2)],
      ['Current Term Weighted', calculationResult.weightedGPA.toFixed(2)],
      ['Cumulative Unweighted', calculationResult.cumulativeUnweightedGPA.toFixed(2)],
      ['Cumulative Weighted', calculationResult.cumulativeWeightedGPA.toFixed(2)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138] }
  });

  // Current Courses Section
  const currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.text('Current Term Courses', 14, currentY);

  const courseData = courses.map(course => [
    course.name,
    course.type,
    `${course.gradePercent}%`,
    course.credits.toString()
  ]);

  autoTable(doc, {
    startY: currentY + 5,
    head: [['Course Name', 'Type', 'Grade', 'Credits']],
    body: courseData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] }
  });

  // Save the PDF
  doc.save('scholar_gpa_report.pdf');
};
