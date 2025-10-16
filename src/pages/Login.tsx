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
        <p className="text-center text-muted-foreground">Faça login para criar e gerenciar suas Histórias.</p>
        <Auth
          supabaseClient={supabase}
          providers={[]}
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
          view="sign_in" // Força a visualização de login
          // Desabilitando links de navegação para outras views (como sign up e forgot password)
          // Isso é feito configurando a propriedade appearance/variables ou usando localization,
          // mas a maneira mais direta é garantir que apenas 'sign_in' seja acessível.
          // Como o Auth UI não tem uma prop direta para desabilitar links, 
          // vamos usar a propriedade 'onlyThirdPartyProviders' como false (já é o caso)
          // e confiar que 'view="sign_in"' restringe a navegação.
          // Se os links persistirem, a única opção é usar CSS ou localization.
          // Vamos tentar usar localization para remover os links de navegação.
          localization={{
            variables: {
              sign_in: {
                link_text: 'Já tem uma conta? Faça login',
              },
              sign_up: {
                link_text: '', // Remove o link de cadastro
              },
              forgotten_password: {
                link_text: '', // Remove o link de recuperação de senha
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;