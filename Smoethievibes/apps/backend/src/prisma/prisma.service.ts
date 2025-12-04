import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Pass the database URL at runtime so Prisma v7+ doesn't require `url` in schema.
    // Keep `as any` to avoid strict typing before regenerating the client.
    super({ datasources: { db: { url: process.env.DATABASE_URL } } } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}