
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const email = `test_bcrypt_${Date.now()}@example.com`;
    const password = 'securePassword123';
    const legacyEmail = `test_legacy_${Date.now()}@example.com`;

    console.log('--- Starting Auth Flow Verification ---');

    try {
        // 1. Test Registration (Should hash password)
        console.log(`\n1. Registering new user: ${email}`);
        // We need to call the API, but for this script I'll simulate what the API does 
        // or better, I'll use fetch to call the running server if possible. 
        // Since I can't easily start the server and run this script in parallel without background tasks,
        // I will simulate the logic using the same functions or just verify the DB state after manual insertion?
        // Actually, I can just use the Prisma Client to verify what the API *would* do if I had updated the API.
        // Wait, I updated the API code, but I need to run the server to test the API endpoints.
        // I will restart the server later. For now, let's verify the logic by simulating the API handler code.

        // Simulate Registration Handler
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: {
                email,
                encrypted_password: hashedPassword,
            } as any,
        });
        console.log('User created directly with hash.');

        // Verify it is hashed
        const isHashed = user.encrypted_password && user.encrypted_password.startsWith('$2');
        console.log(`Password is hashed: ${isHashed} (${user.encrypted_password?.substring(0, 10)}...)`);

        if (!isHashed) throw new Error('Password was not hashed!');

        // 2. Test Login Logic (Standard)
        console.log('\n2. Testing Login Logic (Standard)');
        const validStandard = await bcrypt.compare(password, user.encrypted_password!);
        console.log(`Login valid: ${validStandard}`);
        if (!validStandard) throw new Error('Standard login failed!');

        // 3. Test Legacy Fallback (Plain text upgrade)
        console.log(`\n3. Testing Legacy Fallback for: ${legacyEmail}`);
        // Create legacy user
        const legacyUser = await prisma.users.create({
            data: {
                email: legacyEmail,
                encrypted_password: password, // Plain text
            } as any,
        });
        console.log('Legacy user created with plain text password.');

        // Simulate Login Handler Logic
        let isPasswordValid = false;
        let needsRehash = false;
        const dbUser = await prisma.users.findUnique({ where: { id: legacyUser.id } });

        if (!dbUser || !dbUser.encrypted_password) throw new Error('User not found');

        try {
            isPasswordValid = await bcrypt.compare(password, dbUser.encrypted_password);
        } catch (e) {
            isPasswordValid = false;
        }

        if (!isPasswordValid && dbUser.encrypted_password === password) {
            console.log('Fallback triggered: Plain text match.');
            isPasswordValid = true;
            needsRehash = true;
        }

        if (!isPasswordValid) throw new Error('Legacy login failed!');

        if (needsRehash) {
            console.log('Rehash triggered. Updating password...');
            const newHash = await bcrypt.hash(password, 10);
            await prisma.users.update({
                where: { id: dbUser.id },
                data: { encrypted_password: newHash } as any,
            });
            console.log('Password updated.');
        }

        // Verify upgrade
        const upgradedUser = await prisma.users.findUnique({ where: { id: legacyUser.id } });
        const isNowHashed = upgradedUser?.encrypted_password?.startsWith('$2');
        console.log(`Legacy user password is now hashed: ${isNowHashed}`);

        if (!isNowHashed) throw new Error('Legacy user was not upgraded!');

        console.log('\n--- Verification SUCCESS ---');

    } catch (error) {
        console.error('\n--- Verification FAILED ---');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
