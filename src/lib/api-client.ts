// API Client para comunicação com o backend PostgreSQL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface User {
  id: string;
  email: string;
}

interface AuthResponse {
  user: User;
  session: {
    id: string;
  };
}

interface Flipbook {
  id: string;
  user_id: string;
  title: string;
  pages: any[];
  page_count: number;
  created_at: string;
  updated_at: string;
}

// Gerenciar sessão no localStorage
const SESSION_KEY = 'app_session';
const USER_KEY = 'app_user';

export const getStoredSession = (): string | null => {
  return localStorage.getItem(SESSION_KEY);
};

export const getStoredUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setSession = (session: string, user: User) => {
  localStorage.setItem(SESSION_KEY, session);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
};

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

export const register = async (email: string, password: string): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Erro ao registrar' };
    }

    return { data };
  } catch (error) {
    return { error: 'Erro ao registrar usuário' };
  }
};

export const login = async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Erro ao fazer login' };
    }

    // Armazenar sessão
    setSession(data.session.id, data.user);

    return { data };
  } catch (error) {
    return { error: 'Erro ao fazer login' };
  }
};

export const logout = async () => {
  clearSession();
};

export const checkAuth = (): User | null => {
  return getStoredUser();
};

// ===== FUNÇÕES DE FLIPBOOKS =====

export const getFlipbooks = async (userId: string): Promise<ApiResponse<Flipbook[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/flipbooks?user_id=${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Erro ao listar flipbooks' };
    }

    return { data };
  } catch (error) {
    return { error: 'Erro ao listar flipbooks' };
  }
};

export const getFlipbook = async (id: string): Promise<ApiResponse<Flipbook>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/flipbooks/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Erro ao obter flipbook' };
    }

    return { data };
  } catch (error) {
    return { error: 'Erro ao obter flipbook' };
  }
};

export const createFlipbook = async (
  userId: string,
  title: string,
  pages: any[] = []
): Promise<ApiResponse<Flipbook>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/flipbooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, title, pages }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Erro ao criar flipbook' };
    }

    return { data };
  } catch (error) {
    return { error: 'Erro ao criar flipbook' };
  }
};

export const updateFlipbook = async (
  id: string,
  title?: string,
  pages?: any[]
): Promise<ApiResponse<Flipbook>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/flipbooks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, pages }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Erro ao atualizar flipbook' };
    }

    return { data };
  } catch (error) {
    return { error: 'Erro ao atualizar flipbook' };
  }
};

export const deleteFlipbook = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/flipbooks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return { error: data.error || 'Erro ao deletar flipbook' };
    }

    return {};
  } catch (error) {
    return { error: 'Erro ao deletar flipbook' };
  }
};
