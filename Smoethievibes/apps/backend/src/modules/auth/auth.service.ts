import { Injectable, BadRequestException } from '@nestjs/common';
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
  ) { }

  // Validate email/password credentials
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Email/password login
  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    if (!user) {
      const errorMessage =
        this.configService.get('auth.errorMessages.invalidCredentials') ||
        'Invalid credentials';
      throw new BadRequestException(errorMessage);
    }
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.role || [],
      iss: this.configService.get('auth.token.issuer') || 'smoethievibes',
      aud: this.configService.get('auth.token.audience') || 'smoethievibes-users',
    };
    const accessToken = this.jwtService.sign(payload);
    return { access_token: accessToken, user };
  }

  // Register new user (email/password)
  async register(registerInput: RegisterInput) {
    const { password, ...userData } = registerInput;
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const saltRounds = parseInt(this.configService.get('auth.bcryptSaltRounds') || '10');
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          name: userData.name || null,
          password: hashedPassword,
        },
      });
      const { password: _, ...result } = user;
      const payload = {
        sub: user.id,
        email: user.email,
        roles: user.role || [],
        iss: this.configService.get('auth.token.issuer') || 'smoethievibes',
        aud: this.configService.get('auth.token.audience') || 'smoethievibes-users',
      };
      const accessToken = this.jwtService.sign(payload);
      return { access_token: accessToken, user: result };
    } catch (error: any) {
      const message = error?.meta?.target ? `Field '${error.meta.target[0]}' failed` : error?.message || 'Registration failed';
      throw new BadRequestException(message);
    }
  }

  // Google OAuth login/registration
  async validateGoogleUser(googleUser: any) {
    const { email, firstName, lastName, picture } = googleUser;
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await this.prisma.user.create({
        data: {
          email,
          name: `${firstName} ${lastName}`.trim(),
          password: hashedPassword,
          avatar: picture,
          phone: '', // optional phone field
          isActive: true,
          role: 'CUSTOMER', // default role
        },
      });
    }
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.role || [],
      iss: this.configService.get('auth.token.issuer') || 'smoethievibes',
      aud: this.configService.get('auth.token.audience') || 'smoethievibes-users',
    };
    return { access_token: this.jwtService.sign(payload), user };
  }

  // Complete profile after Google registration
  async completeProfile(userId: string, profileData: { name?: string; phone?: string; address?: string; avatar?: string }) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(profileData.name && { name: profileData.name }),
        ...(profileData.phone && { phone: profileData.phone }),
        ...(profileData.address && { address: profileData.address }),
        ...(profileData.avatar && { avatar: profileData.avatar }),
      },
    });
    const { password, ...result } = updatedUser;
    return result;
  }

  // Update profile
  async updateProfile(userId: string, profileData: { name?: string; phone?: string; address?: string; avatar?: string }) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(profileData.name && { name: profileData.name }),
        ...(profileData.phone && { phone: profileData.phone }),
        ...(profileData.address && { address: profileData.address }),
        ...(profileData.avatar && { avatar: profileData.avatar }),
      },
    });
    const { password, ...result } = updatedUser;
    return result;
  }

  // Get current user profile
  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  // Record last login timestamp
  async recordLastLogin(userId: string) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
    const { password, ...result } = updatedUser;
    return result;
  }
}