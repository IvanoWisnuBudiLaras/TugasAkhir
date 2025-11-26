﻿import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { Request, Response } from 'express';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'log'], // Optimized logging untuk production
  });

  const configService = app.get(ConfigService);

  // Security - optimized untuk GraphQL
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
  
  // CORS - optimized untuk GraphQL subscriptions
  const corsOptions = configService.get('cors');
  app.enableCors({
    ...corsOptions,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-apollo-tracing'],
  });
  
  // Global validation - optimized untuk GraphQL
  // Custom ValidationPipe akan mengambil konfigurasi dari ConfigService
  app.useGlobalPipes(new ValidationPipe(configService));
  
  // Swagger documentation (optional untuk GraphQL)
  const swaggerOptions = configService.get('swagger');
  if (swaggerOptions?.enabled !== false) {
    const config = new DocumentBuilder()
      .setTitle(swaggerOptions?.title || 'Smoethievibes API')
      .setDescription(swaggerOptions?.description || 'Smoethievibes GraphQL API Documentation')
      .setVersion(swaggerOptions?.version || '1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
  
  // Health check endpoint - optimized untuk GraphQL & Fly.io
  app.use('/health', (req: Request, res: Response) => {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'smoethievibes-backend',
      graphql: true,
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  });
  
  // Error handling untuk GraphQL
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
  
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });
  
  await app.listen(port, '0.0.0.0'); // Bind ke 0.0.0.0 untuk Fly.io
  
  const serverStarted = configService.get('messages.info.serverStarted')?.replace('${port}', port.toString()) || `🚀 Server running on port ${port}`;
  const apiDocs = configService.get('messages.info.apiDocs')?.replace('${port}', port.toString()) || `📚 API Documentation: http://localhost:${port}/api`;
  
  console.log('\n🎯 Smoethievibes GraphQL API');
  console.log(serverStarted);
  console.log(apiDocs);
  console.log(`🔍 Health Check: http://localhost:${port}/health`);
  console.log(`🚀 GraphQL Playground: http://localhost:${port}/graphql\n`);
}
bootstrap();