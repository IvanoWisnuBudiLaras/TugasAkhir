import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => ({
  origin: process.env.CORS_ORIGIN || true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: process.env.CORS_CREDENTIALS === 'true',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));