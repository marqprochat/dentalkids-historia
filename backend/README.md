# Backend DentalKids História

Backend Node.js com Express e Prisma para gerenciamento de histórias em flipbooks.

## Setup Inicial

### 1. Instalar PostgreSQL Local

Você precisa ter PostgreSQL instalado. Se não tiver:
- **Windows**: Baixe em https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql@15`
- **Linux**: `sudo apt-get install postgresql`

### 2. Criar banco de dados local

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE dentalkids;

# Sair
\q
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Configurar variáveis de ambiente

O arquivo `.env` já está configurado, mas verifique:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dentalkids"
SUPABASE_DATABASE_URL="seu-url-do-supabase"
```

### 5. Criar schema no banco local

```bash
npx prisma db push
```

## Migração de Dados

Para migrar todos os dados do Supabase para PostgreSQL local:

```bash
npm run migrate
```

Isso vai copiar:
- ✓ Usuários
- ✓ Flipbooks
- ✓ Sessões

## Rodar o servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

O servidor estará disponível em `http://localhost:3000`

## Endpoints da API

### Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login

### Flipbooks

- `GET /flipbooks?user_id=...` - Listar flipbooks do usuário
- `GET /flipbooks/:id` - Obter flipbook específico
- `POST /flipbooks` - Criar novo flipbook
- `PUT /flipbooks/:id` - Atualizar flipbook
- `DELETE /flipbooks/:id` - Deletar flipbook

## Estrutura

```
src/
  ├── server.ts       # Servidor Express principal
  └── migrate.ts      # Script de migração
```

## Troubleshooting

### Erro: "Could not connect to database"

Verifique se PostgreSQL está rodando:
```bash
# Windows
pg_isready -h localhost -p 5432

# macOS/Linux
psql -U postgres -h localhost -c "SELECT 1"
```

### Erro: "Database dentalkids does not exist"

Crie o banco:
```bash
createdb -U postgres dentalkids
```

### Erro: "Invalid connection string"

Verifique as credenciais no `.env`. O padrão é:
- User: `postgres`
- Password: `postgres`
- Host: `localhost`
- Port: `5432`
- Database: `dentalkids`
