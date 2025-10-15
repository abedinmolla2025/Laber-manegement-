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

const loadImageAsBase64 = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const generateLaborPDF = async (labor: Labor) => {
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Header background
  const headerHeight = 20;
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');
  
  // Title in header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Labor Management Report', pageWidth / 2, 14, { align: 'center' });
  
  // Profile Card with photo, name, and address
  const profileY = headerHeight + 10;
  const profileHeight = labor.address ? 45 : 35;
  
  // Profile card background
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, profileY, pageWidth - 30, profileHeight, 3, 3, 'FD');
  
  // Photo - larger and more prominent
  const photoSize = 30;
  const photoX = 20;
  const photoY = profileY + 7.5;
  
  doc.setFillColor(255, 255, 255);
  doc.circle(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 'F');
  
  if (labor.photo) {
    const photoData = await loadImageAsBase64(labor.photo);
    if (photoData) {
      try {
        // Detect format from data URL
        const format = photoData.includes('image/png') ? 'PNG' : 'JPEG';
        doc.addImage(photoData, format, photoX, photoY, photoSize, photoSize, undefined, 'NONE');
      } catch {
        // If image fails to load, show initials instead
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(labor.name.slice(0, 2).toUpperCase(), photoX + photoSize/2, photoY + photoSize/2 + 4, { align: 'center' });
      }
    } else {
      // Photo URL failed to load, show initials
      doc.setTextColor(59, 130, 246);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(labor.name.slice(0, 2).toUpperCase(), photoX + photoSize/2, photoY + photoSize/2 + 4, { align: 'center' });
    }
  } else {
    // No photo provided, show initials
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(labor.name.slice(0, 2).toUpperCase(), photoX + photoSize/2, photoY + photoSize/2 + 4, { align: 'center' });
  }
  
  // Profile information next to photo
  const infoX = photoX + photoSize + 10;
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(labor.name, infoX, profileY + 14);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(59, 130, 246);
  doc.text(`Daily Rate: ₹${labor.dailyRate.toLocaleString()}`, infoX, profileY + 24);
  
  // Address if available
  if (labor.address) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const addressLines = doc.splitTextToSize(`Address: ${labor.address}`, pageWidth - infoX - 20);
    doc.text(addressLines, infoX, profileY + 34);
  }
  
  // Reset text color for content
  doc.setTextColor(0, 0, 0);
  
  const getBengaliDay = (date: Date): string => {
    // Using Romanized Bengali since jsPDF doesn't support Bengali script without custom fonts
    const days = ['Robibar', 'Shombar', 'Mongolbar', 'Budhbar', 'Brihoshpotibar', 'Shukrobar', 'Shonibar'];
    return days[date.getDay()];
  };

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
    // Parse date correctly - handle YYYY-MM-DD format
    const dateParts = entry.date.split('-');
    const date = new Date(
      parseInt(dateParts[0]), 
      parseInt(dateParts[1]) - 1, 
      parseInt(dateParts[2])
    );
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const formattedDate = `${day}/${month}/${year}`;
    const bengaliDay = getBengaliDay(date);
    
    return [
      formattedDate,
      bengaliDay,
      entry.daily,
      entry.rate,
      entry.advance
    ];
  });
  
  autoTable(doc, {
    startY: profileY + profileHeight + 10,
    head: [['Date', 'Day', 'Daily', 'Rate', 'Advance']],
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
      0: { halign: 'left', cellWidth: 35 },
      1: { halign: 'center', cellWidth: 40 },
      2: { halign: 'center', cellWidth: 25 },
      3: { halign: 'center', cellWidth: 40 },
      4: { halign: 'center', cellWidth: 40 }
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

export const previewLaborPDF = async (labor: Labor) => {
  const doc = await generateLaborPDF(labor);
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};

export const downloadLaborPDF = async (labor: Labor) => {
  const doc = await generateLaborPDF(labor);
  doc.save(`${labor.name.replace(/\s+/g, '_')}_labor_report.pdf`);
};
