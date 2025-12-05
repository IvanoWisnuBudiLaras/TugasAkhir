import { registerAs } from '@nestjs/config';
import * as crypto from 'crypto';

// Generate secure random secrets if not provided
const generateSecureSecret = () => crypto.randomBytes(64).toString('hex');

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || generateSecureSecret(),
  expiresIn: process.env.JWT_EXPIRES_IN || '15m', // Reduced from 7d to 15m
  refreshSecret: process.env.JWT_REFRESH_SECRET || generateSecureSecret(),
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // Reduced from 30d to 7d
}));