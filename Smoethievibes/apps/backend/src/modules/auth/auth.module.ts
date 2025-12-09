import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
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
    AuthResolver, 
    JwtStrategy,
    {
      provide: GoogleStrategy,
      useFactory: (configService: ConfigService, authService: AuthService) => {
        const clientID = configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get('GOOGLE_CLIENT_SECRET');
        
        // Only provide GoogleStrategy if credentials are properly configured
        if (clientID && clientSecret && 
            clientID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' && 
            clientID !== 'disable' &&
            clientSecret !== 'YOUR_GOOGLE_CLIENT_SECRET_HERE' && 
            clientSecret !== 'disable') {
          return new GoogleStrategy(configService, authService);
        }
        
        // Return null if Google OAuth is disabled
        return null;
      },
      inject: [ConfigService, AuthService],
    }
  ],
  exports: [AuthService],
})
export class AuthModule { }