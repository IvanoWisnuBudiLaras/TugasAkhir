import { Controller, Get, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtAuthGuard } from '../../common/guards';

@Controller('api/dashboard/performance')
@UseGuards(JwtAuthGuard)
export class PerformanceController {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  @Get('metrics')
  async getMetrics() {
    const today = new Date().toISOString().split('T')[0];
    const metricsKey = `metrics:${today}`;
    
    // Get today's metrics
    const metrics = await this.redisClient.lrange(metricsKey, 0, -1);
    const parsedMetrics: any[] = metrics.map(m => JSON.parse(m));

    // Calculate statistics
    const totalRequests = parsedMetrics.length;
    const avgResponseTime = parsedMetrics.reduce((sum: number, m) => sum + m.responseTime, 0) / totalRequests;
    const errorRate = parsedMetrics.filter(m => m.statusCode >= 400).length / totalRequests * 100;

    // Get hourly stats
    const hourlyStats: Record<string, any> = {};
    for (let hour = 0; hour < 24; hour++) {
      const hourKey = `metrics:hour:${hour}`;
      const hourData = await this.redisClient.hgetall(hourKey);
      if (Object.keys(hourData).length > 0) {
        hourlyStats[`${hour}:00`] = hourData;
      }
    }

    // Get response time distribution
    const responseTimeDist = await this.redisClient.hgetall('metrics:response_times');

    return {
      summary: {
        totalRequests,
        avgResponseTime: Math.round(avgResponseTime),
        errorRate: Math.round(errorRate * 100) / 100,
      },
      hourlyStats,
      responseTimeDistribution: responseTimeDist,
      recentRequests: parsedMetrics.slice(-10).reverse(),
    };
  }

  @Get('system')
  async getSystemInfo() {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      ppid: process.ppid,
    };
  }

  @Get('cache-stats')
  async getCacheStats() {
    try {
      const info = await this.redisClient.info();
      const dbSize = await this.redisClient.dbsize();
      
      return {
        redis: {
          info: this.parseRedisInfo(info),
          dbSize,
        },
      };
    } catch (error) {
      return {
        redis: {
          error: (error as Error).message,
          status: 'disconnected',
        },
      };
    }
  }

  private parseRedisInfo(info: string) {
    const lines = info.split('\r\n');
    const parsed: Record<string, any> = {};
    
    for (const line of lines) {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split(':');
        if (key && value) {
          parsed[key] = isNaN(Number(value)) ? value : Number(value);
        }
      }
    }
    
    return parsed;
  }
}