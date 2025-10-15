import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Labor {
  id: string;
  name: string;
  photo?: string;
  address?: string;
  dailyRate: number;
  totalDaily: number;
  totalDuty: number;
  totalAdvance: number;
  dutyEntries: Array<{ date: string; daily: number; amount: number }>;
  advanceEntries: Array<{ date: string; amount: number }>;
}

export const generateLaborPDF = (labor: Labor) => {
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Header background - adjust height if address is present
  const headerHeight = labor.address ? 60 : 50;
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Labor Management Report', pageWidth / 2, 18, { align: 'center' });
  
  // Laborer name
  doc.setFontSize(16);
  doc.text(`${labor.name}`, pageWidth / 2, 32, { align: 'center' });
  
  // Daily rate
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Daily Rate: ₹${labor.dailyRate.toLocaleString()}`, pageWidth / 2, 42, { align: 'center' });
  
  // Address if available
  if (labor.address) {
    doc.setFontSize(10);
    doc.text(`Address: ${labor.address}`, pageWidth / 2, 52, { align: 'center' });
  }
  
  // Reset text color for content
  doc.setTextColor(0, 0, 0);
  
  const mergedEntries: Array<{ 
    date: string; 
    daily: number | string; 
    rate: number | string; 
    advance: number | string 
  }> = [];
  
  const allDates = new Set<string>();
  labor.dutyEntries.forEach(entry => allDates.add(entry.date));
  labor.advanceEntries.forEach(entry => allDates.add(entry.date));
  
  const sortedDates = Array.from(allDates).sort();
  
  sortedDates.forEach(date => {
    const dutyEntry = labor.dutyEntries.find(d => d.date === date);
    const advanceEntry = labor.advanceEntries.find(a => a.date === date);
    
    mergedEntries.push({
      date,
      daily: dutyEntry ? dutyEntry.daily : '-',
      rate: dutyEntry ? `₹${dutyEntry.amount}` : '-',
      advance: advanceEntry ? `₹${advanceEntry.amount}` : '-'
    });
  });
  
  const tableData = mergedEntries.map(entry => {
    const date = new Date(entry.date);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const formattedDate = `${day}/${month}/${year}`;
    
    return [
      formattedDate,
      entry.daily,
      entry.rate,
      entry.advance
    ];
  });
  
  autoTable(doc, {
    startY: headerHeight + 10,
    head: [['Date', 'Daily', 'Rate', 'Advance']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 5,
      lineWidth: 0.5,
      lineColor: [200, 200, 200]
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.3,
      lineColor: [220, 220, 220]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 50 },
      1: { halign: 'center', cellWidth: 30 },
      2: { halign: 'center', cellWidth: 50 },
      3: { halign: 'center', cellWidth: 50 }
    },
    margin: { left: 15, right: 15 },
    styles: {
      overflow: 'linebreak',
      cellWidth: 'wrap'
    }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  // Summary box
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, finalY - 5, pageWidth - 30, 45, 3, 3, 'S');
  
  // Summary title
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('Summary', 20, finalY + 3);
  
  // Summary details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const netPayable = labor.totalDuty - labor.totalAdvance;
  const leftCol = 20;
  const rightCol = pageWidth / 2 + 10;
  
  doc.text(`Total Daily:`, leftCol, finalY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${labor.totalDaily}`, leftCol + 45, finalY + 14);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Duty:`, leftCol, finalY + 24);
  doc.setFont('helvetica', 'bold');
  doc.text(`₹${labor.totalDuty.toLocaleString()}`, leftCol + 45, finalY + 24);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Advance:`, rightCol, finalY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(`₹${labor.totalAdvance.toLocaleString()}`, rightCol + 50, finalY + 14);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Net Payable:`, rightCol, finalY + 24);
  doc.setFont('helvetica', 'bold');
  if (netPayable >= 0) {
    doc.setTextColor(34, 197, 94);
  } else {
    doc.setTextColor(239, 68, 68);
  }
  doc.text(`₹${netPayable.toLocaleString()}`, rightCol + 50, finalY + 24);
  
  // Footer
  doc.setTextColor(128, 128, 128);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const currentDate = new Date().toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated on: ${currentDate}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text('Labor Management System', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  return doc;
};

export const previewLaborPDF = (labor: Labor) => {
  const doc = generateLaborPDF(labor);
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};

export const downloadLaborPDF = (labor: Labor) => {
  const doc = generateLaborPDF(labor);
  doc.save(`${labor.name.replace(/\s+/g, '_')}_labor_report.pdf`);
};
