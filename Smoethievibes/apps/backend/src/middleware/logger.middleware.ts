import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Get logger configuration
    const loggerEnabled = this.configService.get('logger.enabled', true);
    const skipRoutes = this.configService.get('logger.skipRoutes', []);
    const format = this.configService.get('logger.format', {
      includeTimestamp: true,
      includeMethod: true,
      includeUrl: true,
      includeStatus: true,
      includeDuration: true,
      includeIp: true,
    });
    const template = this.configService.get('logger.template');

    // Skip logging if disabled
    if (!loggerEnabled) {
      return next();
    }

    // Skip certain routes
    if (skipRoutes.includes(req.originalUrl)) {
      return next();
    }

    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const { method, originalUrl, ip } = req;
      const { statusCode } = res;
      
      // Build log message based on config
      const logParts = [];
      
      if (format.includeTimestamp) {
        logParts.push(`[${new Date().toISOString()}]`);
      }
      
      if (format.includeMethod) {
        logParts.push(method);
      }
      
      if (format.includeUrl) {
        logParts.push(originalUrl);
      }
      
      if (format.includeStatus) {
        logParts.push(statusCode.toString());
      }
      
      if (format.includeDuration) {
        logParts.push(`-${duration}ms`);
      }
      
      if (format.includeIp) {
        logParts.push(`-${ip}`);
      }
      
      // Use custom template if provided, otherwise use default format
      let logMessage;
      if (template) {
        logMessage = template
          .replace('{timestamp}', new Date().toISOString())
          .replace('{method}', method)
          .replace('{url}', originalUrl)
          .replace('{status}', statusCode.toString())
          .replace('{duration}', `${duration}ms`)
          .replace('{ip}', ip || 'unknown');
      } else {
        logMessage = logParts.join(' ');
      }
      
      console.log(logMessage);
    });

    next();
  }
}