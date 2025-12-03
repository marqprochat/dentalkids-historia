import { PrismaClient } from '../generated/prisma';

// Criar dois clientes Prisma - um para Supabase, outro para PostgreSQL local
const supabase = new PrismaClient({
  datasources: {
    db: {
      url: process.env.SUPABASE_DATABASE_URL || 'postgresql://postgres.crphxcbvdzuqfuwvczkh:Edy92153474@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public',
    },
  },
});

const postgres = new PrismaClient({
  datasources: {
    db: {
      url: process.env.LOCAL_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dentalkids',
    },
  },
});

async function migrateData() {
  try {
    console.log('🚀 Iniciando migração de dados do Supabase para PostgreSQL local...\n');

    // 1. Migrar usuários
    console.log('📝 Migrando usuários...');
    const users = await supabase.users.findMany();
    console.log(`   Encontrados ${users.length} usuários`);

    for (const user of users) {
      try {
        await postgres.users.upsert({
          where: { id: user.id },
          update: {
            email: user.email,
            encrypted_password: user.encrypted_password,
            role: user.role,
            email_confirmed_at: user.email_confirmed_at,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
          create: {
            id: user.id,
            email: user.email,
            encrypted_password: user.encrypted_password,
            role: user.role,
            email_confirmed_at: user.email_confirmed_at,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        });
      } catch (error) {
        console.error(`   ⚠️  Erro ao migrar usuário ${user.id}:`, error);
      }
    }
    console.log('   ✓ Usuários migrados\n');

    // 2. Migrar flipbooks
    console.log('📚 Migrando flipbooks...');
    const flipbooks = await supabase.flipbooks.findMany();
    console.log(`   Encontrados ${flipbooks.length} flipbooks`);

    for (const flipbook of flipbooks) {
      try {
        await postgres.flipbooks.upsert({
          where: { id: flipbook.id },
          update: {
            title: flipbook.title,
            pages: flipbook.pages,
            page_count: flipbook.page_count,
            storage_path: flipbook.storage_path,
            created_at: flipbook.created_at,
            user_id: flipbook.user_id,
          },
          create: {
            id: flipbook.id,
            title: flipbook.title,
            pages: flipbook.pages,
            page_count: flipbook.page_count,
            storage_path: flipbook.storage_path,
            created_at: flipbook.created_at,
            user_id: flipbook.user_id,
          },
        });
      } catch (error) {
        console.error(`   ⚠️  Erro ao migrar flipbook ${flipbook.id}:`, error);
      }
    }
    console.log('   ✓ Flipbooks migrados\n');

    // 3. Migrar sessões
    console.log('🔐 Migrando sessões...');
    const sessions = await supabase.sessions.findMany();
    console.log(`   Encontradas ${sessions.length} sessões`);

    for (const session of sessions) {
      try {
        await postgres.sessions.upsert({
          where: { id: session.id },
          update: {
            user_id: session.user_id,
            created_at: session.created_at,
            updated_at: session.updated_at,
          },
          create: {
            id: session.id,
            user_id: session.user_id,
            created_at: session.created_at,
            updated_at: session.updated_at,
          },
        });
      } catch (error) {
        console.error(`   ⚠️  Erro ao migrar sessão ${session.id}:`, error);
      }
    }
    console.log('   ✓ Sessões migradas\n');

    console.log('✅ Migração concluída com sucesso!');
    console.log(`\n📊 Resumo:`);
    console.log(`   - ${users.length} usuários`);
    console.log(`   - ${flipbooks.length} flipbooks`);
    console.log(`   - ${sessions.length} sessões`);
  } catch (error) {
    console.error('❌ Erro durante migração:', error);
  } finally {
    await supabase.$disconnect();
    await postgres.$disconnect();
  }
}

// Executar migração
migrateData();
