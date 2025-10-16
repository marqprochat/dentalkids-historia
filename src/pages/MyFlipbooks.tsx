import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

interface Flipbook {
  id: string;
  created_at: string;
  title: string;
  page_count: number;
}

const fetchMyFlipbooks = async (): Promise<Flipbook[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("flipbooks")
    .select("id, created_at, title, page_count") // Apenas metadados, sem as páginas
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Flipbook[];
};

const deleteFlipbook = async (id: string) => {
  const { error } = await supabase.from("flipbooks").delete().eq("id", id);
  if (error) throw error;
};

const MyFlipbooks = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [flipbookToDelete, setFlipbookToDelete] = useState<string | null>(null);

  const { data: flipbooks, isLoading, error } = useQuery<Flipbook[], Error>({
    queryKey: ["myFlipbooks"],
    queryFn: fetchMyFlipbooks,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFlipbook,
    onSuccess: () => {
      toast.success("Flipbook excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["myFlipbooks"] });
      setFlipbookToDelete(null);
    },
    onError: (err) => {
      toast.error("Erro ao excluir flipbook.");
      console.error(err);
    },
  });

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
        Erro ao carregar seus flipbooks: {error.message}
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
                Novo Flipbook
              </Link>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </header>

        <main>
          {flipbooks && flipbooks.length === 0 ? (
            <div className="text-center p-16 border-2 border-dashed border-border rounded-lg bg-card/50">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl font-medium text-muted-foreground">
                Você ainda não criou nenhum flipbook.
              </p>
              <Button asChild className="mt-6">
                <Link to="/create">Começar a criar</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flipbooks?.map((flipbook) => (
                <Card key={flipbook.id} className="hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg truncate">
                      {flipbook.title}
                    </CardTitle>
                    <CardDescription>
                      Criado em {new Date(flipbook.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {flipbook.page_count} páginas
                    </div>
                    <div className="flex gap-3">
                      <Button asChild className="flex-1 gap-2">
                        <Link to={`/flipbook/${flipbook.id}`}>
                          <BookOpen className="w-4 h-4" />
                          Ver
                        </Link>
                      </Button>
                      
                      <AlertDialog open={flipbookToDelete === flipbook.id} onOpenChange={(open) => setFlipbookToDelete(open ? flipbook.id : null)}>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending && flipbookToDelete === flipbook.id ? (
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
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente seu flipbook.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteMutation.mutate(flipbook.id)}
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

export default MyFlipbooks;