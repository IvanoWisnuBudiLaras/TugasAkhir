import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

interface PerformanceMetrics {
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const timestamp = new Date().toISOString();

    // Override res.end to capture response time
    const originalEnd = res.end;
    const self = this;
    
    (res as any).end = function(this: Response, chunk?: any, encoding?: BufferEncoding, cb?: () => void): Response {
      const responseTime = Date.now() - start;
      
      // Collect metrics
      const metrics: PerformanceMetrics = {
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        responseTime,
        timestamp,
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress,
      };

      // Store metrics in Redis for real-time monitoring
      self.storeMetrics(metrics);

      // Log slow requests (>1 second)
      if (responseTime > 1000) {
        console.warn(`🐌 Slow request detected: ${req.method} ${req.url} - ${responseTime}ms`);
      }

      // Call original end
      if (typeof chunk === 'function') {
        return originalEnd.call(this, chunk as any, encoding || 'utf8' as BufferEncoding, cb);
      } else if (typeof encoding === 'function') {
        return originalEnd.call(this, chunk, encoding as any, cb);
      } else {
        return originalEnd.call(this, chunk, encoding || 'utf8' as BufferEncoding, cb);
      }
    };

    next();
  }

  private async storeMetrics(metrics: PerformanceMetrics) {
    try {
      const key = `metrics:${new Date().toISOString().split('T')[0]}`;
      const pipeline = this.redisClient.pipeline();

      // Store detailed metrics
      pipeline.lpush(key, JSON.stringify(metrics));
      pipeline.expire(key, 86400); // Keep for 24 hours

      // Update counters
      const hourKey = `metrics:hour:${new Date().getHours()}`;
      pipeline.hincrby(hourKey, 'total_requests', 1);
      pipeline.hincrby(hourKey, String(metrics.statusCode), 1);
      pipeline.expire(hourKey, 3600); // Keep for 1 hour

      // Response time histogram
      const timeBucket = this.getTimeBucket(metrics.responseTime);
      pipeline.hincrby('metrics:response_times', timeBucket, 1);

      await pipeline.exec();
    } catch (error) {
      console.error('Failed to store metrics:', error);
    }
  }

  private getTimeBucket(responseTime: number): string {
    if (responseTime < 100) return '0-100ms';
    if (responseTime < 200) return '100-200ms';
    if (responseTime < 500) return '200-500ms';
    if (responseTime < 1000) return '500-1000ms';
    if (responseTime < 2000) return '1-2s';
    return '2s+';
  }
}