import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => ({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: process.env.CORS_CREDENTIALS === 'true' || true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Size'],
  maxAge: 86400, // 24 hours
}));