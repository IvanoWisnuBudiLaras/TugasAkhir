import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

/**
 * @controller Aplikasi
 * @deskripsi Controller root untuk health check dan status sistem
 * @endpoints
 *   GET  /health  - Health check sistem dengan status koneksi database
 */
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @endpoint GET /health
   * @deskripsi Health check endpoint untuk monitoring dan container orchestration
   * @fitur Test konektivitas database
   * @returns Objek status dengan timestamp, status layanan, dan detail error jika unhealthy
   */
  @Get('health')
  async getHealth() {
    try {
      // @test Validasi koneksi database
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          api: 'running'
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected',
          api: 'running'
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
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