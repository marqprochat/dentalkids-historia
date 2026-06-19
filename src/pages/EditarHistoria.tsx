import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { PDFUploader } from "@/components/PDFUploader";
import { processPDF } from "@/utils/pdfProcessor";
import { Loader2, LogOut, Home, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getFlipbook, updateFlipbookPages, logout, checkAuth } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";

const base64ToBlob = (base64: string, mimeType: string = 'image/png'): Blob => {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

const processPages = async (processedPages: string[]): Promise<any[]> => {
  return processedPages.map((pageData, index) => ({
    index,
    data: base64ToBlob(pageData),
  }));
};

const EditarHistoria = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = checkAuth();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!id) return;

    getFlipbook(id).then((result) => {
      if (result.error || !result.data) {
        toast.error("História não encontrada.");
        navigate('/');
        return;
      }
      setTitle(result.data.title);
      setPageCount(result.data.page_count);
      setIsLoading(false);
    });
  }, [id, navigate]);

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
      setProcessingStatus("Processando seu PDF...");
      const processedPages = await processPDF(file);
      toast.success(`${processedPages.length} páginas processadas!`);

      setProcessingStatus("Preparando as novas páginas...");
      const pagesData = await processPages(processedPages);

      setProcessingStatus("Salvando a história atualizada...");
      const result = await updateFlipbookPages(id!, title.trim(), pagesData);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("História atualizada! O link continua o mesmo.");
      navigate(`/historia/${id}`);
    } catch (error: any) {
      console.error("Erro ao atualizar história:", error);
      toast.error(`Erro ao atualizar: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const handleSaveTitle = async () => {
    if (!title.trim()) {
      toast.error("O título não pode estar vazio.");
      return;
    }
    const result = await updateFlipbookPages(id!, title.trim(), []);
    if (result.error) {
      toast.error("Erro ao salvar título.");
    } else {
      toast.success("Título atualizado!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-book-page/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
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
              <p className="text-lg text-muted-foreground">{processingStatus}</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="rounded-lg border bg-card p-4 flex items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Link atual:</span>{" "}
                  <span className="font-mono">/historia/{id}</span>
                  <span className="ml-2 text-xs">({pageCount} páginas)</span>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1 shrink-0">
                  <Link to={`/historia/${id}`} target="_blank">
                    <ExternalLink className="w-3 h-3" />
                    Ver história
                  </Link>
                </Button>
              </div>

              <div className="space-y-3">
                <Label htmlFor="historia-title" className="text-lg font-semibold">
                  Título da História
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="historia-title"
                    placeholder="Ex: A Aventura do Dentista Mirim"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg p-6"
                  />
                  <Button onClick={handleSaveTitle} variant="outline" className="px-6 shrink-0">
                    Salvar título
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-semibold">Substituir PDF</Label>
                <p className="text-sm text-muted-foreground">
                  Faça upload de um novo PDF para substituir as páginas atuais. O link compartilhado permanece o mesmo.
                </p>
                <PDFUploader onFileSelect={handleFileSelect} />
              </div>
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

export default EditarHistoria;
