import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    if (!user) {
      const errorMessage = this.configService.get('auth.errorMessages.invalidCredentials') || 'Invalid credentials';
      throw new Error(errorMessage);
    }
    
    // Generate JWT token
    const payload = { 
      sub: user.id, 
      email: user.email,
      roles: user.roles || [],
      iss: this.configService.get('auth.token.issuer') || 'smoethievibes',
      aud: this.configService.get('auth.token.audience') || 'smoethievibes-users',
    };
    
    const accessToken = this.jwtService.sign(payload);
    
    return {
      access_token: accessToken,
      user,
    };
  }

  async register(registerInput: RegisterInput) {
    const { password, ...userData } = registerInput;
    const saltRounds = parseInt(this.configService.get('auth.bcryptSaltRounds') || '10');
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    const { password: _, ...result } = user;
    
    // Generate JWT token
    const payload = { 
      sub: user.id, 
      email: user.email,
      roles: user.role || [],
      iss: this.configService.get('auth.token.issuer') || 'smoethievibes',
      aud: this.configService.get('auth.token.audience') || 'smoethievibes-users',
    };
    
    const accessToken = this.jwtService.sign(payload);
    
    return {
      access_token: accessToken,
      user: result,
    };
  }
}