import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private readonly message: string;
  private readonly redisClient: Redis;

  constructor(
    private configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {
    this.windowMs = parseInt(this.configService.get('RATE_LIMIT_WINDOW_MS', '86400000')); // 24 jam
    this.maxRequests = parseInt(this.configService.get('RATE_LIMIT_MAX_REQUESTS', '100')); // 100 requests per hari
    this.message = 'Too many requests from this IP, please try again later.';
    this.redisClient = redis;
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const window = Math.floor(Date.now() / this.windowMs);
    const key = `rate_limit:${ip}:${window}`;
    
    try {
      const current = await this.redisClient.incr(key);
      
      // Set expiry hanya pada first request
      if (current === 1) {
        await this.redisClient.expire(key, Math.ceil(this.windowMs / 1000));
      }
      
      // Set headers untuk informasi rate limit
      res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - current).toString());
      res.setHeader('X-RateLimit-Reset', new Date((window + 1) * this.windowMs).toISOString());
      
      if (current > this.maxRequests) {
        res.status(429).json({
          success: false,
          message: this.message,
          retryAfter: Math.ceil(this.windowMs / 1000),
        });
        return;
      }
      
      next();
    } catch (error) {
      // Fallback ke next() jika Redis error
      console.error('Rate limiter Redis error:', error);
      next();
    }
  }
}