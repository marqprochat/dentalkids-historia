
import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('Connecting to database...');
    try {
        const users = await prisma.users.findMany({
            take: 10,
            select: {
                id: true,
                email: true,
                encrypted_password: true,
                deleted_at: true,
            },
        });

        console.log('Found users:', users.length);
        users.forEach(u => {
            console.log(`ID: ${u.id}`);
            console.log(`Email: ${u.email}`);
            console.log(`Password: ${u.encrypted_password ? u.encrypted_password.substring(0, 10) + '...' : 'null'}`);
            console.log(`Deleted At: ${u.deleted_at}`);
            console.log('---');
        });
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
