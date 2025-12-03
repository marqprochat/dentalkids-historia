import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app: Express = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nome único: timestamp + numero aleatorio + extensao original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB por arquivo
  }
});

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir arquivos estáticos (imagens dos flipbooks)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running' });
});

// ===== ROTAS DE AUTENTICAÇÃO =====

// Registrar novo usuário
app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email e senha são obrigatórios' });
      return;
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.users.findFirst({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ error: 'Usuário já existe' });
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const user = await prisma.users.create({
      data: {
        email,
        encrypted_password: hashedPassword,
      } as any,
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Login
app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email e senha são obrigatórios' });
      return;
    }

    const user = await prisma.users.findFirst({
      where: { email },
    });

    if (!user || !user.encrypted_password) {
      res.status(401).json({ error: 'Email ou senha inválidos' });
      return;
    }

    // Verificar senha
    let isPasswordValid = false;
    let needsRehash = false;

    // 1. Tentar comparar como hash bcrypt
    try {
      isPasswordValid = await bcrypt.compare(password, user.encrypted_password);
    } catch (e) {
      // Se falhar (ex: não é um hash válido), assumir inválido por enquanto
      isPasswordValid = false;
    }

    // 2. Fallback: Se não for válido como hash, verificar se é texto plano (legado)
    if (!isPasswordValid && user.encrypted_password === password) {
      isPasswordValid = true;
      needsRehash = true;
    }

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Email ou senha inválidos' });
      return;
    }

    // Se for senha antiga (texto plano), atualizar para hash
    if (needsRehash) {
      const newHash = await bcrypt.hash(password, 10);
      await prisma.users.update({
        where: { id: user.id },
        data: { encrypted_password: newHash } as any,
      });
      console.log(`Senha do usuário ${user.email} atualizada para hash seguro.`);
    }

    // Criar sessão
    const session = await prisma.sessions.create({
      data: {
        user_id: user.id,
      } as any,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
      },
      session: {
        id: session.id,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// ===== ROTAS DE FLIPBOOKS =====

// Listar flipbooks do usuário
app.get('/flipbooks', async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id as string;

    if (!userId) {
      res.status(400).json({ error: 'user_id é obrigatório' });
      return;
    }

    const flipbooks = await prisma.flipbooks.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    res.json(flipbooks);
  } catch (error) {
    console.error('Erro ao listar flipbooks:', error);
    res.status(500).json({ error: 'Erro ao listar flipbooks' });
  }
});

// Obter flipbook específico
app.get('/flipbooks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const flipbook = await prisma.flipbooks.findUnique({
      where: { id },
    });

    if (!flipbook) {
      res.status(404).json({ error: 'Flipbook não encontrado' });
      return;
    }

    res.json(flipbook);
  } catch (error) {
    console.error('Erro ao obter flipbook:', error);
    res.status(500).json({ error: 'Erro ao obter flipbook' });
  }
});

// Criar flipbook (com upload de arquivos)
app.post('/flipbooks', upload.array('pages'), async (req: Request, res: Response) => {
  try {
    const { user_id, title } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!user_id) {
      res.status(400).json({ error: 'user_id é obrigatório' });
      return;
    }

    // Processar arquivos enviados
    let pageUrls: string[] = [];

    if (files && files.length > 0) {
      // Gerar URLs para os arquivos salvos
      // Assumindo que o servidor está rodando na mesma máquina/domínio
      // Em produção, você pode querer usar uma variável de ambiente para a URL base
      const baseUrl = process.env.API_URL || `http://localhost:${PORT}`;

      pageUrls = files.map(file => {
        return `${baseUrl}/uploads/${file.filename}`;
      });
    } else if (req.body.pages && Array.isArray(req.body.pages)) {
      // Fallback para o método antigo (base64 no body), caso o frontend ainda envie assim
      // Mas idealmente devemos migrar para upload de arquivos
      pageUrls = req.body.pages;
    }

    const flipbook = await prisma.flipbooks.create({
      data: {
        user_id,
        title: title || 'Novo Flipbook',
        pages: pageUrls,
        page_count: pageUrls.length,
      },
    });

    res.status(201).json(flipbook);
  } catch (error) {
    console.error('Erro ao criar flipbook:', error);
    res.status(500).json({ error: 'Erro ao criar flipbook' });
  }
});

// Atualizar flipbook
app.put('/flipbooks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, pages } = req.body;

    const flipbook = await prisma.flipbooks.update({
      where: { id },
      data: {
        title,
        pages,
        page_count: pages?.length,
      },
    });

    res.json(flipbook);
  } catch (error) {
    console.error('Erro ao atualizar flipbook:', error);
    res.status(500).json({ error: 'Erro ao atualizar flipbook' });
  }
});

// Deletar flipbook
app.delete('/flipbooks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Deletar arquivos físicos associados ao flipbook
    // Isso requer ler o flipbook antes de deletar para pegar os nomes dos arquivos

    await prisma.flipbooks.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar flipbook:', error);
    res.status(500).json({ error: 'Erro ao deletar flipbook' });
  }
});

// Tratamento de erros global
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error('Erro global:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
});

export default app;
