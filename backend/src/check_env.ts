
import dotenv from 'dotenv';
import path from 'path';

// Load .env from the current directory (backend)
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('--- Environment Check ---');
console.log('Current Directory:', process.cwd());
console.log('Loading .env from:', path.join(__dirname, '../.env'));

const dbUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

function maskUrl(url: string | undefined) {
    if (!url) return 'undefined';
    try {
        // Basic masking for postgres://user:pass@host:port/db
        return url.replace(/:\/\/[^:]+:[^@]+@/, '://****:****@');
    } catch (e) {
        return 'error_masking_url';
    }
}

console.log('DATABASE_URL:', maskUrl(dbUrl));
console.log('DIRECT_URL:', maskUrl(directUrl));

if (dbUrl && dbUrl.includes('supabase')) {
    console.log('WARNING: DATABASE_URL appears to be a Supabase URL.');
} else if (dbUrl && dbUrl.includes('localhost')) {
    console.log('INFO: DATABASE_URL appears to be a Localhost URL.');
}

console.log('-------------------------');
