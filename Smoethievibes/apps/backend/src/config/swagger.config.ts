import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  enabled: process.env.NODE_ENV !== 'production',
  title: process.env.SWAGGER_TITLE || 'Smoethievibes API',
  description: process.env.SWAGGER_DESCRIPTION || 'Smoethievibes API Documentation',
  version: process.env.SWAGGER_VERSION || '1.0',
}));