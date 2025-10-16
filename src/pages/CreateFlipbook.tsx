import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PDFUploader } from "@/components/PDFUploader";
import { processPDF } from "@/utils/pdfProcessor";
import { Loader2, LogOut, Home } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";

const CreateFlipbook = () => {
  const [title, setTitle] = useState("");
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
    if (!title.trim()) {
      toast.error("Por favor, insira um título para o Flipbook.");
      return;
    }

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
        .insert([{ pages: processedPages, user_id: user.id, title: title.trim() }])
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
        <header className="flex justify-between items-center mb-12 space-y-4">
          <Logo linkTo="/" className="h-12" />
          <div className="flex gap-4">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                Meus Flipbooks
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
                <Label htmlFor="flipbook-title" className="text-lg font-semibold">Título do Flipbook</Label>
                <Input
                  id="flipbook-title"
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

export default CreateFlipbook;