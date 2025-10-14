// Inform TypeScript about the global variables from the CDN scripts
// We will access them via the window object for robustness.

// Helper function to wait for libraries with a retry mechanism
const checkLibraries = (retries = 10, delay = 200): Promise<boolean> => {
    return new Promise((resolve) => {
        const tryCheck = (attempt: number) => {
            const html2canvas = (window as any).html2canvas;
            const jspdf = (window as any).jspdf;

            if (html2canvas && jspdf) {
                resolve(true);
            } else if (attempt < retries) {
                setTimeout(() => tryCheck(attempt + 1), delay);
            } else {
                resolve(false);
            }
        };
        tryCheck(0);
    });
};


export const generatePdf = async (elementId: string, fileName: string): Promise<void> => {
  const librariesLoaded = await checkLibraries();
  
  if (!librariesLoaded) {
    console.error("html2canvas or jspdf is not loaded. Check the script tags in index.html.");
    alert("Errore nella generazione del PDF. Le librerie necessarie non sono state caricate in tempo. Riprova tra qualche istante.");
    return;
  }

  const html2canvas = (window as any).html2canvas;
  const jspdf = (window as any).jspdf;

  const resultsElement = document.getElementById(elementId);
  if (!resultsElement) {
    console.error("Element not found for PDF generation");
    alert("Errore interno: impossibile trovare l'elemento dei risultati per la stampa.");
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
    alert("Si è verificato un errore durante la creazione del PDF.");
  } finally {
     // Hide the elements again after capture
     elementsToUnhide.forEach(el => el.classList.add('hidden'));
  }
};