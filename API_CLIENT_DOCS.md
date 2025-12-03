# API Client Documentation

## Visão Geral

O arquivo `src/lib/api-client.ts` fornece um cliente HTTP tipado para comunicação com o backend PostgreSQL Express. Ele abstrai todas as chamadas HTTP e gerencia a autenticação localmente.

## Configuração

### Variável de Ambiente

```env
# .env
VITE_API_URL=http://localhost:3000
```

A URL será usada como base para todos os endpoints da API.

## Tipos Principais

```typescript
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

interface ApiResponse<T> {
  data?: T;
  error?: string;
}
```

## Funções de Autenticação

### `register(email: string, password: string)`

Registra um novo usuário.

**Endpoint:** `POST /auth/register`

**Parâmetros:**
- `email` - Email do usuário
- `password` - Senha do usuário

**Retorno:** `ApiResponse<User>`

**Exemplo:**
```typescript
const result = await register('user@example.com', 'password123');
if (result.error) {
  console.error(result.error);
} else {
  console.log('Usuário registrado:', result.data);
}
```

---

### `login(email: string, password: string)`

Faz login do usuário e armazena a sessão.

**Endpoint:** `POST /auth/login`

**Parâmetros:**
- `email` - Email do usuário
- `password` - Senha do usuário

**Retorno:** `ApiResponse<AuthResponse>`

**Efeito colateral:** Armazena sessão e dados do usuário em `localStorage`

**Exemplo:**
```typescript
const result = await login('user@example.com', 'password123');
if (result.error) {
  console.error(result.error);
} else {
  navigate('/'); // Redirecionar após login bem-sucedido
}
```

---

### `logout()`

Faz logout removendo a sessão do localStorage.

**Não requer parâmetros**

**Exemplo:**
```typescript
await logout();
navigate('/login');
```

---

### `checkAuth()`

Verifica se há usuário autenticado e retorna seus dados.

**Retorno:** `User | null`

**Exemplo:**
```typescript
const user = checkAuth();
if (user) {
  console.log('Usuário autenticado:', user.email);
} else {
  console.log('Usuário não autenticado');
}
```

## Funções de Flipbooks

### `getFlipbooks(userId: string)`

Lista todos os flipbooks de um usuário.

**Endpoint:** `GET /flipbooks?user_id={userId}`

**Parâmetros:**
- `userId` - ID do usuário

**Retorno:** `ApiResponse<Flipbook[]>`

**Exemplo:**
```typescript
const user = checkAuth();
if (user) {
  const result = await getFlipbooks(user.id);
  if (result.error) {
    console.error(result.error);
  } else {
    console.log('Flipbooks:', result.data);
  }
}
```

---

### `getFlipbook(id: string)`

Obtém um flipbook específico.

**Endpoint:** `GET /flipbooks/{id}`

**Parâmetros:**
- `id` - ID do flipbook

**Retorno:** `ApiResponse<Flipbook>`

**Exemplo:**
```typescript
const result = await getFlipbook('flipbook-123');
if (result.error) {
  console.error('Flipbook não encontrado');
} else {
  console.log('Páginas:', result.data?.pages);
}
```

---

### `createFlipbook(userId: string, title: string, pages?: any[])`

Cria um novo flipbook.

**Endpoint:** `POST /flipbooks`

**Parâmetros:**
- `userId` - ID do usuário proprietário
- `title` - Título do flipbook
- `pages` - (Opcional) Array de páginas (cada página pode ser um objeto com base64)

**Retorno:** `ApiResponse<Flipbook>`

**Exemplo:**
```typescript
const user = checkAuth();
if (user) {
  const result = await createFlipbook(user.id, 'Minha História', [
    { index: 0, data: 'data:image/png;base64,...' },
    { index: 1, data: 'data:image/png;base64,...' }
  ]);
  
  if (result.error) {
    console.error('Erro:', result.error);
  } else {
    navigate(`/historia/${result.data?.id}`);
  }
}
```

---

### `updateFlipbook(id: string, title?: string, pages?: any[])`

Atualiza um flipbook existente.

**Endpoint:** `PUT /flipbooks/{id}`

**Parâmetros:**
- `id` - ID do flipbook
- `title` - (Opcional) Novo título
- `pages` - (Opcional) Novas páginas

**Retorno:** `ApiResponse<Flipbook>`

**Exemplo:**
```typescript
const result = await updateFlipbook('flipbook-123', 'Novo Título', newPages);
if (result.error) {
  console.error('Erro ao atualizar');
} else {
  console.log('Flipbook atualizado');
}
```

---

### `deleteFlipbook(id: string)`

Deleta um flipbook.

**Endpoint:** `DELETE /flipbooks/{id}`

**Parâmetros:**
- `id` - ID do flipbook

**Retorno:** `ApiResponse<void>`

**Exemplo:**
```typescript
const result = await deleteFlipbook('flipbook-123');
if (result.error) {
  console.error('Erro ao deletar');
} else {
  console.log('Flipbook deletado');
}
```

## Gerenciamento de Sessão

### Funções de Utilidade Interna

```typescript
// Obter sessão armazenada
const sessionId = getStoredSession(); // string | null

// Obter usuário armazenado
const user = getStoredUser(); // User | null

// Armazenar sessão após login
setSession(sessionId, user);

// Limpar sessão após logout
clearSession();
```

## Tratamento de Erros

Todas as funções retornam um `ApiResponse<T>` que contém `data` OU `error`, mas nunca ambos:

```typescript
const result = await someFunction();

if (result.error) {
  // Trata o erro
  toast.error(result.error);
} else {
  // Usa os dados
  console.log(result.data);
}
```

## Exemplo de Fluxo Completo

```typescript
import { login, checkAuth, getFlipbooks, logout } from '@/lib/api-client';

// 1. Login
const loginResult = await login('user@example.com', 'password');
if (loginResult.error) {
  // Erro no login
  return;
}

// 2. Verificar autenticação
const user = checkAuth();
console.log('Autenticado como:', user?.email);

// 3. Buscar flipbooks
const flipbooksResult = await getFlipbooks(user!.id);
if (!flipbooksResult.error) {
  console.log('Suas histórias:', flipbooksResult.data);
}

// 4. Logout
await logout();
```

---

*Documentação do Client API - dentalkids-historia*
