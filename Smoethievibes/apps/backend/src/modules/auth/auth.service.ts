import { Injectable, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('EMAIL_SERVICE') private emailService: any,
  ) { }

  // Validate email/password credentials
  async validateUser(email: string, password: string): Promise<any> {
    // Validasi input
    if (!email || !password) {
      return null;
    }
    
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Check if email exists
  async checkEmailExists(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.prisma.user.findUnique({ 
      where: { email },
      select: { 
        id: true, 
        email: true, 
        isActive: true,
        createdAt: true 
      }
    });

    return {
      exists: !!user,
      isActive: user?.isActive || false
    };
  }

  // Generate and send OTP for given email and action
  async sendOtp(email: string, action: 'LOGIN' | 'REGISTER' = 'LOGIN') {
    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Cek apakah user sudah terdaftar dan statusnya
    const user = await this.prisma.user.findUnique({ 
      where: { email },
      select: { id: true, email: true, isActive: true }
    });

    // Jika user sudah terdaftar tapi belum aktif, otomatis kirim OTP untuk LOGIN
    if (user && !user.isActive) {
      action = 'LOGIN';
    }

    // Jika user belum terdaftar tapi actionnya LOGIN, ubah menjadi REGISTER
    if (!user && action === 'LOGIN') {
      action = 'REGISTER';
    }

    // Hapus OTP lama untuk email ini
    await (this.prisma as any).oTP.deleteMany({
      where: { email }
    });

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await (this.prisma as any).oTP.create({
      data: {
        email,
        code,
        action,
        expiresAt,
      },
    });

    try {
      await this.emailService.sendOtp(email, code);
    } catch (err) {
      console.warn('EmailService failed to send OTP, fallback to console:', err);
      console.log(`OTP for ${email}: ${code}`);
    }

    return { message: 'OTP sent successfully' };
  }

  // Email/password login - return JWT on success
  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    if (!user) {
      const errorMessage =
        this.configService.get('auth.errorMessages.invalidCredentials') ||
        'Invalid credentials';
      throw new UnauthorizedException(errorMessage);
    }

    // Cek apakah user aktif
    if (!user.isActive) {
      // Kirim OTP untuk aktivasi
      await this.sendOtp(user.email, 'LOGIN');
      throw new UnauthorizedException('Account not activated. Please check your email for OTP verification.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: (user as any).role || [],
      iss: this.configService.get('auth.token.issuer') || 'smoethievibes',
      aud: this.configService.get('auth.token.audience') || 'smoethievibes-users',
    };
    const accessToken = this.jwtService.sign(payload);
    
    // Update last login
    await this.recordLastLogin(user.id);
    
    return { access_token: accessToken, user };
  }

  // Login with OTP only (for existing users)
  async loginWithOtp(email: string, code: string) {
    // Validasi input
    if (!email || !code) {
      throw new BadRequestException('Email and OTP code are required');
    }
    
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      throw new BadRequestException('OTP must be 6 digits');
    }

    // Cek apakah user sudah terdaftar
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found. Please register first.');
    }

    // Cek apakah user aktif
    if (!user.isActive) {
      throw new BadRequestException('Account not activated. Please verify your email first.');
    }

    // Verify OTP
    const otpRow = await (this.prisma as any).oTP.findFirst({ 
      where: { 
        email, 
        code 
      }, 
      orderBy: { createdAt: 'desc' } 
    });
    
    if (!otpRow) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > otpRow.expiresAt) {
      throw new BadRequestException('OTP expired');
    }

    // Consume OTP
    await (this.prisma as any).oTP.deleteMany({ where: { email, code } });

    // Update last login
    await this.prisma.user.update({ 
      where: { id: user.id }, 
      data: { lastLogin: new Date() } 
    });

    const payload = { 
      sub: user.id, 
      email: user.email, 
      roles: user.role || [], 
      iss: this.configService.get('auth.token.issuer') || 'smoethievibes', 
      aud: this.configService.get('auth.token.audience') || 'smoethievibes-users' 
    };
    
    const accessToken = this.jwtService.sign(payload);
    const { password, ...result } = user;
    return { access_token: accessToken, user: result };
  }

  // Verify OTP using DB-backed OTP rows; return JWT
  async verifyOtp(email: string, code: string) {
    // Validasi input
    if (!email || !code) {
      throw new BadRequestException('Email and OTP code are required');
    }
    
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      throw new BadRequestException('OTP must be 6 digits');
    }

    // Check OTP table first
    const otpRow = await (this.prisma as any).oTP.findFirst({ 
      where: { 
        email, 
        code 
      }, 
      orderBy: { createdAt: 'desc' } 
    });
    
    if (!otpRow) {
      // Fallback to legacy user fields
      const userFallback = await this.prisma.user.findUnique({ where: { email } });
      if (!userFallback) throw new BadRequestException('User not found');
      if (!userFallback.otpCode || !userFallback.otpExpiresAt) throw new BadRequestException('No OTP found. Please login again.');
      if (userFallback.otpCode !== code) throw new BadRequestException('Invalid OTP');
      if (new Date() > userFallback.otpExpiresAt) throw new BadRequestException('OTP expired');
      
      // Aktifkan user dan bersihkan OTP
      await this.prisma.user.update({ 
        where: { id: userFallback.id }, 
        data: { 
          otpCode: null, 
          otpExpiresAt: null, 
          isActive: true,
          lastLogin: new Date()
        } 
      });
      
      const payload = { 
        sub: userFallback.id, 
        email: userFallback.email, 
        roles: userFallback.role || [], 
        iss: this.configService.get('auth.token.issuer') || 'smoethievibes', 
        aud: this.configService.get('auth.token.audience') || 'smoethievibes-users' 
      };
      
      const accessToken = this.jwtService.sign(payload);
      const { password, ...result } = userFallback;
      return { access_token: accessToken, user: result };
    }

    if (new Date() > otpRow.expiresAt) {
      throw new BadRequestException('OTP expired');
    }

    // Consume OTP(s)
    await (this.prisma as any).oTP.deleteMany({ where: { email, code } });

    // Find user and mark active
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');
    
    // Aktifkan user dan update last login
    await this.prisma.user.update({ 
      where: { id: user.id }, 
      data: { 
        isActive: true, 
        otpCode: null, 
        otpExpiresAt: null,
        lastLogin: new Date()
      } 
    });

    const payload = { 
      sub: user.id, 
      email: user.email, 
      roles: user.role || [], 
      iss: this.configService.get('auth.token.issuer') || 'smoethievibes', 
      aud: this.configService.get('auth.token.audience') || 'smoethievibes-users' 
    };
    
    const accessToken = this.jwtService.sign(payload);
    const { password, ...result } = user;
    return { access_token: accessToken, user: result };
  }

  // Register new user (email/password)
  async register(registerInput: RegisterInput) {
    const { password, ...userData } = registerInput;
    
    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new BadRequestException('Invalid email format');
    }
    
    // Validasi password strength
    if (!password || password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }
    
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
          isActive: false, // Default inactive, akan diaktifkan setelah OTP
          role: 'CUSTOMER', // Default role
        },
      });

      // Generate and send OTP immediately after registration
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          otpCode: otp,
          otpExpiresAt: otpExpiresAt,
        },
      });

      await this.emailService.sendOtp(user.email, otp);

      return { message: 'Registration successful. Please check your email for OTP verification.', email: user.email };
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