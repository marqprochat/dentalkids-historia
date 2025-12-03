
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Attempting to register user: ${email}`);

    try {
        // 1. Check if user exists
        console.log('Checking if user exists...');
        const existingUser = await prisma.users.findFirst({
            where: { email },
        });

        if (existingUser) {
            console.log('ERROR: User already exists (unexpected for random email)');
            console.log('Existing user:', existingUser);
            return;
        } else {
            console.log('User does not exist. Proceeding to create...');
        }

        // 2. Create user
        console.log('Creating user...');
        const user = await prisma.users.create({
            data: {
                email,
                encrypted_password: password,
            } as any,
        });

        console.log('SUCCESS: User created:', user);

    } catch (error) {
        console.error('ERROR during registration:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
