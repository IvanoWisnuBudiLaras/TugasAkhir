import { Controller, Get, Inject } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import Redis from 'ioredis';

/**
 * @controller Aplikasi
 * @deskripsi Controller root untuk health check dan status sistem
 * @endpoints
 *   GET  /health  - Health check sistem dengan status koneksi database
 */
@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  /**
   * @endpoint GET /health
   * @deskripsi Health check endpoint untuk monitoring dan container orchestration
   * @fitur Test konektivitas database
   * @returns Objek status dengan timestamp, status layanan, dan detail error jika unhealthy
   */
  @Get('health')
  async getHealth() {
    const health: any = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unknown',
        redis: 'unknown',
        api: 'running'
      },
      metrics: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      }
    };

    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      health.services.database = 'connected';
    } catch (error) {
      health.services.database = 'disconnected';
      health.status = 'unhealthy';
      health.services.error = error instanceof Error ? error.message : 'Unknown error';
    }

    try {
      // Test Redis connection
      await this.redisClient.ping();
      health.services.redis = 'connected';
    } catch (error) {
      health.services.redis = 'disconnected';
      health.status = 'unhealthy';
      health.services.redisError = error instanceof Error ? error.message : 'Unknown error';
    }

    return health;
  }

  @Get()
  getHello() {
    return {
      message: 'Welcome to SmoethieVibes API',
      version: '1.0.0',
      status: 'running'
    };
  }
}