
// Inform TypeScript about the global variables from the CDN scripts
declare const html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
declare const jspdf: { jsPDF: new (options?: any) => any };

export const generatePdf = async (elementId: string, fileName: string): Promise<void> => {
  const resultsElement = document.getElementById(elementId);
  if (!resultsElement) {
    console.error("Element not found for PDF generation");
    return;
  }
  
  // Temporarily make hidden elements visible for capture
  const elementsToUnhide = resultsElement.querySelectorAll('.pdf-unhide');
  elementsToUnhide.forEach(el => el.classList.remove('hidden'));
  
  try {
    const canvas = await html2canvas(resultsElement, {
      scale: 2, // Higher scale for better quality
      backgroundColor: '#1e293b' // Match the slate-800 background
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Using jsPDF from the global scope (window.jspdf)
    const { jsPDF } = jspdf;
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / ratio;
    
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
    
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
    
    pdf.save(fileName);

  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
     // Hide the elements again after capture
     elementsToUnhide.forEach(el => el.classList.add('hidden'));
  }
};
