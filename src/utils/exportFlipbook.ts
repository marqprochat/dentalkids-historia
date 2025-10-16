import { jsPDF } from 'jspdf';

export const exportFlipbookAsPDF = async (pages: string[]) => {
  try {
    // Criar novo documento PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Dimensões A4 em mm
    const pageWidth = 210;
    const pageHeight = 297;

    // Adicionar cada página ao PDF
    for (let i = 0; i < pages.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      // Adicionar a imagem à página
      pdf.addImage(
        pages[i],
        'PNG',
        0,
        0,
        pageWidth,
        pageHeight,
        undefined,
        'FAST'
      );
    }

    // Salvar o PDF
    pdf.save(`flipbook-${Date.now()}.pdf`);
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    throw error;
  }
};
