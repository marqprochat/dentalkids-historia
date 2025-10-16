import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FlipBook } from "@/components/FlipBook";
import { Loader2, AlertTriangle, Share2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";

const FlipbookViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    const fetchFlipbook = async () => {
      if (!id) {
        setError("ID do Flipbook não encontrado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("flipbooks")
          .select("pages")
          .eq("id", id)
          .single();

        if (error) {
          throw new Error("Flipbook não encontrado ou erro na busca.");
        }

        if (data && Array.isArray(data.pages)) {
          setPages(data.pages);
        } else {
          throw new Error("Flipbook não encontrado ou formato de dados inválido.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlipbook();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copiado para a área de transferência!");
  };

  if (loading || isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-lg text-muted-foreground">Carregando seu flipbook...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center p-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <h2 className="text-2xl font-bold">Oops! Algo deu errado.</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button asChild>
          <Link to="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-book-page/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Logo linkTo={isAuthenticated ? "/" : undefined} className="h-10" />
          {isAuthenticated && (
            <Button asChild variant="outline" className="gap-2">
              <Link to="/create">
                <Home className="w-4 h-4" />
                Criar Novo Flipbook
              </Link>
            </Button>
          )}
          <Button onClick={handleShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            Compartilhar
          </Button>
        </header>
        <main className="max-w-6xl mx-auto">
          <FlipBook pages={pages} />
        </main>
      </div>
    </div>
  );
};

export default FlipbookViewer;