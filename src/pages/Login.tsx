import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { login, register, checkAuth } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // Redireciona para home se já está autenticado
    if (checkAuth()) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await register(email, password);
        if (result.error) {
          setError(result.error);
          setIsLoading(false);
          return;
        }
        // Após registrar, fazer login automaticamente
        const loginResult = await login(email, password);
        if (loginResult.error) {
          setError(loginResult.error);
        } else {
          navigate('/');
        }
      } else {
        const result = await login(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError('Erro ao processar requisição');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-xl border border-border">
        <h1 className="text-3xl font-bold text-center text-primary">
          {isSignUp ? 'Criar Conta' : 'Acesso do Criador'}
        </h1>
        <p className="text-center text-muted-foreground">
          {isSignUp
            ? 'Crie uma conta para acessar suas histórias.'
            : 'Faça login para criar e gerenciar suas Histórias.'}
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processando...' : isSignUp ? 'Criar Conta' : 'Fazer Login'}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            {isSignUp ? 'Já tem uma conta? Faça login' : 'Não tem conta? Crie uma'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;