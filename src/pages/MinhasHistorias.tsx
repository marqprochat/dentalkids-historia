import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFlipbooks, deleteFlipbook, logout, checkAuth } from "@/lib/api-client";
import { Loader2, BookOpen, Trash2, LogOut, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Logo from "@/components/Logo";

interface Historia {
  id: string;
  created_at: string;
  title: string;
  page_count: number;
}

const fetchMinhasHistorias = async (): Promise<Historia[]> => {
  const user = checkAuth();
  if (!user) throw new Error("Usuário não autenticado.");

  const result = await getFlipbooks(user.id);
  if (result.error) throw new Error(result.error);
  
  return (result.data || []) as Historia[];
};

const deleteHistoriaHandler = async (id: string) => {
  const result = await deleteFlipbook(id);
  if (result.error) throw new Error(result.error);
};

const MinhasHistorias = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [historiaParaExcluir, setHistoriaParaExcluir] = useState<string | null>(null);

  // Redireciona para login se não autenticado
  const user = checkAuth();
  if (!user) {
    navigate('/login');
  }

  const { data: historias, isLoading, error } = useQuery<Historia[], Error>({
    queryKey: ["minhasHistorias"],
    queryFn: fetchMinhasHistorias,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHistoriaHandler,
    onSuccess: () => {
      toast.success("História excluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["minhasHistorias"] });
      setHistoriaParaExcluir(null);
    },
    onError: (err) => {
      toast.error("Erro ao excluir história.");
      console.error(err);
    },
  });

  const handleLogout = async () => {
    await logout();
    toast.success("Logout realizado com sucesso.");
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Erro ao carregar suas histórias: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-book-page/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <Logo linkTo="/" className="h-12" />
          <div className="flex gap-4">
            <Button asChild className="gap-2">
              <Link to="/create">
                <PlusCircle className="w-4 h-4" />
                Nova História
              </Link>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </header>

        <main>
          {historias && historias.length === 0 ? (
            <div className="text-center p-16 border-2 border-dashed border-border rounded-lg bg-card/50">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl font-medium text-muted-foreground">
                Você ainda não criou nenhuma história.
              </p>
              <Button asChild className="mt-6">
                <Link to="/create">Começar a criar</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historias?.map((historia) => (
                <Card key={historia.id} className="hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg truncate">
                      {historia.title}
                    </CardTitle>
                    <CardDescription>
                      Criado em {new Date(historia.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {historia.page_count} páginas
                    </div>
                    <div className="flex gap-3">
                      <Button asChild className="flex-1 gap-2">
                        <Link to={`/historia/${historia.id}`}>
                          <BookOpen className="w-4 h-4" />
                          Ver
                        </Link>
                      </Button>
                      
                      <AlertDialog open={historiaParaExcluir === historia.id} onOpenChange={(open) => setHistoriaParaExcluir(open ? historia.id : null)}>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending && historiaParaExcluir === historia.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente sua história e todos os seus arquivos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteMutation.mutate(historia.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MinhasHistorias;