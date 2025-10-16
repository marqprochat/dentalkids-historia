import { jsPDF } from 'jspdf';

export const exportFlipbookAsPDF = async (pages: string[]) => {
  try {
    console.log('Iniciando exportação de PDF com', pages.length, 'páginas');
    
    // Criar novo documento PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Dimensões A4 em mm
    const pageWidth = 210;
    const pageHeight = 297;

    // Adicionar cada página ao PDF
    for (let i = 0; i < pages.length; i++) {
      console.log(`Processando página ${i + 1}/${pages.length}`);
      
      if (i > 0) {
        pdf.addPage();
      }

      // Determinar o formato da imagem
      const imageFormat = pages[i].startsWith('data:image/png') ? 'PNG' : 'JPEG';
      
      // Adicionar a imagem à página
      pdf.addImage(
        pages[i],
        imageFormat,
        0,
        0,
        pageWidth,
        pageHeight,
        `page-${i}`,
        'FAST'
      );
    }

    console.log('Salvando PDF...');
    // Salvar o PDF
    pdf.save(`flipbook-${Date.now()}.pdf`);
    console.log('PDF exportado com sucesso!');
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    throw error;
  }
};
