import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * @module ModulAuth
 * @deskripsi Handle autentikasi & otorisasi untuk aplikasi
 * @fitur
 *   - Generasi dan validasi JWT token
 *   - Login dan registrasi dengan Email/Password
 *   - Integrasi Google OAuth 2.0
 *   - Verifikasi OTP untuk akses yang aman
 *   - Manajemen profil pengguna
 */
@Module({
  imports: [
    PrismaModule,
    // @fitur Konfigurasi JWT dengan secret dan expiration yang dynamic
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    // @fitur GraphQL resolver untuk auth queries dan mutations
    AuthResolver, 
    // @fitur JWT strategy untuk request authentication
    JwtStrategy,
    // @fitur Google OAuth 2.0 strategy (conditional provider berdasarkan konfigurasi)
    {
      provide: GoogleStrategy,
      useFactory: (configService: ConfigService, authService: AuthService) => {
        const clientID = configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get('GOOGLE_CLIENT_SECRET');
        
        // @validasi Hanya sediakan GoogleStrategy jika credentials dikonfigurasi dengan benar
        if (clientID && clientSecret && 
            clientID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' && 
            clientID !== 'disable' &&
            clientSecret !== 'YOUR_GOOGLE_CLIENT_SECRET_HERE' && 
            clientSecret !== 'disable') {
          return new GoogleStrategy(configService, authService);
        }
        
        // @info Google OAuth akan disabled jika credentials tidak dikonfigurasi
        return null;
      },
      inject: [ConfigService, AuthService],
    }
  ],
  exports: [AuthService],
})
export class AuthModule { }