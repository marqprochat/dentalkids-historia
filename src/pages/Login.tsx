import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Redireciona para a página inicial após o login
        navigate('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-xl border border-border">
        <h1 className="text-3xl font-bold text-center text-primary">Acesso do Criador</h1>
        <p className="text-center text-muted-foreground">Faça login para criar e gerenciar seus Flipbooks.</p>
        <Auth
          supabaseClient={supabase}
          providers={[]} // Sem provedores de terceiros
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--accent))',
                },
              },
            },
          }}
          theme="light"
          view="sign_in" // Focando apenas no login
        />
      </div>
    </div>
  );
};

export default Login;