import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { checkAuth } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

const AuthLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const user = checkAuth();
      setIsAuthenticated(!!user);
      setLoading(false);
      
      if (!user) {
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Se não houver autenticação após o carregamento, não renderiza nada, pois o navigate já foi chamado.
    return null; 
  }

  return <Outlet />;
};

export default AuthLayout;