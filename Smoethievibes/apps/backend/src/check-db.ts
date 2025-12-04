import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Load .env manually
const envPath = path.resolve(__dirname, '../../../.env');
console.log('Loading .env from:', envPath);
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
            process.env[key] = value;
        }
    });
} else {
    console.log('.env file not found');
}

async function main() {
    console.log('Checking DB connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found (length: ' + process.env.DATABASE_URL.length + ')' : 'Missing');

    const prisma = new PrismaClient({
        datasources: { db: { url: process.env.DATABASE_URL } }
    });

    try {
        await prisma.$connect();
        console.log('Successfully connected to DB');
        const userCount = await prisma.user.count();
        console.log('User count:', userCount);
        const user = await prisma.user.findFirst();
        if (user) {
            console.log('User email:', user.email);
            console.log('User password:', user.password);
        }
    } catch (e) {
        console.error('Failed to connect to DB:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
