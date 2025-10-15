import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Labor {
  id: string;
  name: string;
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
  
  doc.setFontSize(20);
  doc.text('Labor Management', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text(`Laborer: ${labor.name}`, pageWidth / 2, 35, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Daily Rate: ₹${labor.dailyRate}`, pageWidth / 2, 45, { align: 'center' });
  
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
  
  const tableData = mergedEntries.map(entry => [
    entry.date,
    entry.daily,
    entry.rate,
    entry.advance
  ]);
  
  autoTable(doc, {
    startY: 55,
    head: [['Date', 'Daily', 'Rate', 'Advance']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 10,
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { halign: 'left' },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    },
    margin: { left: 15, right: 15 }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  
  const netPayable = labor.totalDuty - labor.totalAdvance;
  
  doc.text(`Total Daily: ${labor.totalDaily}`, 15, finalY);
  doc.text(`Total Duty: ₹${labor.totalDuty}`, 15, finalY + 8);
  doc.text(`Total Advance: ₹${labor.totalAdvance}`, 15, finalY + 16);
  doc.text(`Net Payable: ₹${netPayable}`, 15, finalY + 24);
  
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
