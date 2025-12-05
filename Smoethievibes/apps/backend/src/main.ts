﻿import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { Request, Response } from 'express';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  // @fitur Inisialisasi aplikasi NestJS dengan module utama
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'log'], // Logging yang dioptimalkan untuk production
  });

  const configService = app.get(ConfigService);

  // @keamanan Security headers Helmet untuk GraphQL dan REST endpoints
  // Relax some CSP rules in non-production to allow GraphQL Playground assets
  // (Playground loads scripts/styles from CDNs and injects inline scripts).
  const isProd = process.env.NODE_ENV === 'production';
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // Allow external styles over HTTPS and inline styles (required by some dev UIs)
        styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
        // In development allow CDN scripts and inline execution for Playground only.
        scriptSrc: isProd ? ["'self'"] : ["'self'", "'unsafe-inline'", 'https:'],
        // Images from data URIs and HTTPS are allowed
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // @fitur Konfigurasi CORS untuk GraphQL subscriptions dan REST API
  const corsOptions = configService.get('cors');
  app.enableCors({
    ...corsOptions,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-apollo-tracing'],
  });

  // @fitur Global validation pipe dengan custom error handling
  app.useGlobalPipes(new ValidationPipe(configService));

  // @fitur Dokumentasi Swagger untuk REST API endpoints
  const swaggerOptions = configService.get('swagger');
  if (swaggerOptions?.enabled !== false) {
    const config = new DocumentBuilder()
      .setTitle(swaggerOptions?.title || 'Smoethievibes API')
      .setDescription(swaggerOptions?.description || 'Dokumentasi GraphQL & REST API Smoethievibes')
      .setVersion(swaggerOptions?.version || '1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  // @fitur Health check endpoint untuk monitoring dan container orchestration
  app.use('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'smoethievibes-backend',
      endpoints: {
        graphql: `http://localhost:${port}/graphql`,
        rest: `http://localhost:${port}/api`,
        health: `http://localhost:${port}/health`,
      },
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  });

  // @penanganan-error Global error handlers untuk unhandled promises dan exceptions
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
  });

  // @fitur Mulai server listening di semua interface (0.0.0.0) untuk container deployment
  await app.listen(port, '0.0.0.0');

  const serverStarted = configService.get('messages.info.serverStarted')?.replace('${port}', port.toString()) || `🚀 Server berjalan di port ${port}`;
  const apiDocs = configService.get('messages.info.apiDocs')?.replace('${port}', port.toString()) || `📚 Dokumentasi API: http://localhost:${port}/api`;

  console.log('\n🎯 Smoethievibes GraphQL API');
  console.log(serverStarted);
  console.log(apiDocs);
  console.log(`🔍 Health Check: http://localhost:${port}/health`);
  console.log(`🚀 GraphQL Playground: http://localhost:${port}/graphql`);
  console.log(`📊 REST API Docs: http://localhost:${port}/api\n`);
}
bootstrap();