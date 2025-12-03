import { useState, useEffect } from 'react';
import { checkAuth } from '@/lib/api-client';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkSession = () => {
      const user = checkAuth();
      setAuthState({
        isAuthenticated: !!user,
        isLoading: false,
      });
    };

    checkSession();
  }, []);

  return authState;
};