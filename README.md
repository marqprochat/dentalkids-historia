# 📚 DentalKids Historia - Interactive Flipbook Creator

Uma aplicação web moderna para criar e compartilhar histórias interativas a partir de PDFs, voltada para o público infantil de odontologia.

## ✨ Características

- 📖 Converter PDFs em livros interativos com efeito page-flip
- 👨‍💻 Criar, editar e deletar histórias
- 🔐 Autenticação segura com PostgreSQL
- 📱 Responsivo e mobile-friendly
- 🎨 Interface moderna com Tailwind CSS e shadcn/ui
- 🚀 Backend Express com Prisma ORM

## 🏗️ Arquitetura

### Frontend
- **React 18** + TypeScript
- **Vite** para build rápido
- **React Router** para navegação
- **TanStack Query** para gerenciamento de estado
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes

### Backend
- **Express.js** com TypeScript
- **Prisma** como ORM
- **PostgreSQL** como banco de dados
- **CORS** habilitado para comunicação frontend-backend

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+
- pnpm ou npm
- PostgreSQL rodando localmente

### Instalação

#### 1. Clone o repositório
```bash
git clone <repo-url>
cd dentalkids-historia
```

#### 2. Instale as dependências do Frontend
```bash
pnpm install
```

#### 3. Configure o Backend

```bash
cd backend
pnpm install
```

#### 4. Configure as variáveis de ambiente

**Frontend** - `.env`
```env
VITE_API_URL=http://localhost:3000
```

**Backend** - `backend/.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dentalkids"
PORT=3000
```

#### 5. Setup do banco de dados

```bash
cd backend
npm run migrate
```

### Desenvolvimento

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Servidor rodará em http://localhost:3000
```

#### Terminal 2 - Frontend
```bash
pnpm dev
# Acesse http://localhost:8080
```

## 📁 Estrutura do Projeto

```
dentalkids-historia/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Hooks customizados
│   ├── lib/
│   │   └── api-client.ts   # Cliente HTTP para backend
│   ├── layouts/            # Layouts (Auth, Default)
│   ├── utils/              # Utilidades
│   └── App.tsx            # Componente raiz
├── backend/                # Backend Express
│   ├── src/
│   │   ├── server.ts      # Servidor principal
│   │   └── migrate.ts     # Script de migração
│   └── prisma/
│       └── schema.prisma  # Schema do banco de dados
├── public/                 # Arquivos estáticos
└── dist/                   # Build de produção (gerado)
```

## 🔑 Principais Funcionalidades

### Autenticação
- Registro de novo usuário
- Login com email e senha
- Logout
- Sessão persistente em localStorage

### Histórias (Flipbooks)
- Criar nova história a partir de PDF
- Listar todas as histórias do usuário
- Visualizar história com efeito page-flip
- Deletar história
- Compartilhar link da história

### PDF Processing
- Upload de PDF
- Conversão de páginas em imagens
- Armazenamento em base64 no banco de dados

## 🛠️ Comandos Úteis

### Frontend
```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Preview do build
pnpm preview

# Lint
pnpm lint
```

### Backend
```bash
# Desenvolvimento com watch
npm run dev

# Build
npm run build

# Migração de dados
npm run migrate
```

## 🔐 Segurança

- Senhas armazenadas em texto simples no banco (considere usar bcrypt)
- CORS habilitado apenas para localhost em desenvolvimento
- JWT tokens recomendados para produção

## 📊 API Endpoints

### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Fazer login

### Flipbooks
- `GET /flipbooks` - Listar flipbooks (requer `user_id`)
- `GET /flipbooks/:id` - Obter flipbook específico
- `POST /flipbooks` - Criar flipbook
- `PUT /flipbooks/:id` - Atualizar flipbook
- `DELETE /flipbooks/:id` - Deletar flipbook

## 📖 Documentação

Consulte os seguintes arquivos para mais informações:

- **[QUICK_START.md](./QUICK_START.md)** - Guia rápido de início
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Resumo da migração do Supabase
- **[API_CLIENT_DOCS.md](./API_CLIENT_DOCS.md)** - Documentação completa da API cliente
- **[MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)** - Checklist de testes

## 🚀 Deployment

### Frontend
1. Execute `pnpm build`
2. Faça upload dos arquivos em `dist/` para seu servidor web
3. Configure variáveis de ambiente para produção

### Backend
1. Configure variáveis de ambiente de produção
2. Execute migrations: `npm run migrate`
3. Inicie o servidor: `npm run build && npm start`

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👥 Autores

- DentalKids Team

## 🆘 Suporte

Para reportar bugs ou pedir features, abra uma issue no repositório.

---

**Última atualização:** December 2, 2025  
**Status:** ✅ Produção Pronta
