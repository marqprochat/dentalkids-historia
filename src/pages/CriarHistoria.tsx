import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PDFUploader } from "@/components/PDFUploader";
import { processPDF } from "@/utils/pdfProcessor";
import { Loader2, LogOut, Home } from "lucide-react";
import { toast } from "sonner";
import { createFlipbook, logout, checkAuth } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";

// Função auxiliar para converter a imagem de base64 para um array de dados
const processPages = async (processedPages: string[]): Promise<any[]> => {
  return processedPages.map((pageData, index) => ({
    index,
    data: pageData,
  }));
};

const CriarHistoria = () => {
  const [title, setTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logout realizado com sucesso.");
    navigate('/login');
  };

  const handleFileSelect = async (file: File) => {
    if (!title.trim()) {
      toast.error("Por favor, insira um título para a História.");
      return;
    }

    setIsProcessing(true);
    try {
      const user = checkAuth();
      if (!user) {
        toast.error("Você precisa estar logado para criar uma história.");
        navigate('/login');
        return;
      }

      setProcessingStatus("Processando seu PDF...");
      const processedPages = await processPDF(file);
      toast.success(`${processedPages.length} páginas processadas com sucesso!`);

      setProcessingStatus("Preparando dados da história...");
      const pagesData = await processPages(processedPages);

      setProcessingStatus("Finalizando e salvando sua história...");
      const result = await createFlipbook(user.id, title.trim(), pagesData);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        toast.success("História salva! Redirecionando...");
        navigate(`/historia/${result.data.id}`);
      }
    } catch (error: any) {
      console.error("Erro ao criar história:", error);
      toast.error(`Erro ao criar a história: ${error.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-book-page/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12 space-y-4">
          <Logo linkTo="/" className="h-12" />
          <div className="flex gap-4">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                Minhas Histórias
              </Link>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-lg text-muted-foreground">
                {processingStatus}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="historia-title" className="text-lg font-semibold">Título da História</Label>
                <Input
                  id="historia-title"
                  placeholder="Ex: A Aventura do Dentista Mirim"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg p-6"
                />
              </div>
              <PDFUploader onFileSelect={handleFileSelect} />
            </div>
          )}
        </main>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Transforme seus PDFs em livros interativos</p>
        </footer>
      </div>
    </div>
  );
};

export default CriarHistoria;