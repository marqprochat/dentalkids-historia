import { useState } from "react";
import { PDFUploader } from "@/components/PDFUploader";
import { FlipBook } from "@/components/FlipBook";
import { processPDF } from "@/utils/pdfProcessor";
import { exportFlipbookAsHTML } from "@/utils/exportFlipbook";
import { BookOpenCheck, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [pages, setPages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    try {
      const processedPages = await processPDF(file);
      setPages(processedPages);
      toast.success(`${processedPages.length} páginas processadas com sucesso!`);
    } catch (error) {
      console.error("Erro ao processar PDF:", error);
      toast.error("Erro ao processar o PDF. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setPages([]);
  };

  const handleExport = () => {
    exportFlipbookAsHTML(pages);
    toast.success("Flipbook exportado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-book-page/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
              <BookOpenCheck className="relative w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PDF Flipbook
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transforme seus PDFs de livros horizontais em uma experiência de leitura interativa
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-lg text-muted-foreground">
                Processando seu PDF...
              </p>
            </div>
          ) : pages.length === 0 ? (
            <PDFUploader onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-8">
              <div className="flex justify-center gap-3">
                <Button
                  onClick={handleReset}
                  variant="secondary"
                >
                  Carregar outro PDF
                </Button>
                <Button
                  onClick={handleExport}
                  variant="default"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar Flipbook
                </Button>
              </div>
              <FlipBook pages={pages} />
            </div>
          )}
        </main>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Arraste as páginas ou use os controles para navegar pelo livro</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
