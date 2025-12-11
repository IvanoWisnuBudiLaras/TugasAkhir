import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Konfigurasi connection pool optimal untuk 1000+ pengguna
    const connectionString = process.env.DATABASE_URL!;
    const pool = new Pool({
      connectionString,
      max: 20, // Maksimal 20 koneksi untuk PostgreSQL
      idleTimeoutMillis: 10000, // Idle timeout 10 detik
      connectionTimeoutMillis: 30000, // Connection timeout 30 detik
    });

    const adapter = new PrismaPg(pool);

    super({
      // Performance optimizations
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error'],
      errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
      // Connection pool configuration untuk Prisma v7
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}