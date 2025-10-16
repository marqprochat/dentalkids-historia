import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFUploader } from "@/components/PDFUploader";
import { processPDF } from "@/utils/pdfProcessor";
import { BookOpenCheck, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao fazer logout.");
      console.error(error);
    } else {
      toast.success("Logout realizado com sucesso.");
      navigate('/login');
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado para criar um flipbook.");
        navigate('/login');
        return;
      }

      setProcessingStatus("Processando seu PDF...");
      const processedPages = await processPDF(file);
      toast.success(`${processedPages.length} páginas processadas com sucesso!`);

      setProcessingStatus("Salvando seu flipbook...");
      const { data, error } = await supabase
        .from("flipbooks")
        .insert([{ pages: processedPages, user_id: user.id }])
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        toast.success("Flipbook salvo! Redirecionando...");
        navigate(`/flipbook/${data.id}`);
      }
    } catch (error) {
      console.error("Erro ao criar flipbook:", error);
      toast.error("Erro ao criar o flipbook. Tente novamente.");
      setIsProcessing(false);
    }
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
              PDF Flipbook Creator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transforme seus PDFs de livros horizontais em uma experiência de leitura interativa
          </p>
          <div className="flex justify-center">
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
            <PDFUploader onFileSelect={handleFileSelect} />
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