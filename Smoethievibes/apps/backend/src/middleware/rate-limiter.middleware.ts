import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly requests = new Map<string, RateLimitInfo>();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  private readonly message: string;

  constructor(private configService: ConfigService) {
    this.windowMs = this.configService.get('rateLimit.windowMs', 900000);
    this.maxRequests = this.configService.get('rateLimit.max', 100);
    this.message = this.configService.get('rateLimit.message', 'Too many requests from this IP, please try again later.');
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    const requestInfo = this.requests.get(ip);
    
    if (!requestInfo || now > requestInfo.resetTime) {
      this.requests.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return next();
    }
    
    if (requestInfo.count >= this.maxRequests) {
      res.status(429).json({
        success: false,
        message: this.message,
        retryAfter: Math.ceil((requestInfo.resetTime - now) / 1000),
      });
      return;
    }
    
    requestInfo.count++;
    next();
  }
}