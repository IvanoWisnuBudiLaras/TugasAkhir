import { Injectable, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { EmailService } from '../email/email.service';
import type { EmailService as EmailServiceType } from '../email/email.service';
import { ValidationUtil } from '../../common/utils/validation.util';
// import MESSAGES from '../../config/messages.config';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('EMAIL_SERVICE') private emailService: any,
  ) { }

  private get messages() {
    return this.configService.get('messages');
  }

  // Validate email/password credentials
  async validateUser(email: string, password: string): Promise<any> {
    // Validate input
    if (!email || !password) {
      return null;
    }
    
    const sanitizedEmail = ValidationUtil.sanitizeEmail(email);
    const user = await this.prisma.user.findUnique({ where: { email: sanitizedEmail } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Check if email exists
  async checkEmailExists(email: string) {
    ValidationUtil.validateRequiredFields({ email }, ['email']);
    
    if (!ValidationUtil.validateEmail(email)) {
      throw new BadRequestException(this.messages.errors.invalidEmail);
    }

    const sanitizedEmail = ValidationUtil.sanitizeEmail(email);
    const user = await this.prisma.user.findUnique({ 
      where: { email: sanitizedEmail },
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
    // Validate email format
    ValidationUtil.validateRequiredFields({ email }, ['email']);
    
    if (!ValidationUtil.validateEmail(email)) {
      throw new BadRequestException(this.messages.errors.invalidEmail);
    }

    const sanitizedEmail = ValidationUtil.sanitizeEmail(email);
    
    // Check if user exists and status
    const user = await this.prisma.user.findUnique({ 
      where: { email: sanitizedEmail },
      select: { id: true, email: true, isActive: true }
    });

    // If user exists but inactive, auto send OTP for LOGIN
    if (user && !user.isActive) {
      action = 'LOGIN';
    }

    // If user doesn't exist but action is LOGIN, change to REGISTER
    if (!user && action === 'LOGIN') {
      action = 'REGISTER';
    }

    // Hapus OTP lama untuk email ini
    await (this.prisma as any).oTP.deleteMany({
      where: { email }
    });

    const code = ValidationUtil.generateOTP(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.prisma.otp.create({
      data: {
        email: sanitizedEmail,
        code,
        action,
        expiresAt,
      },
    });

    try {
      await this.emailService.sendOtp(sanitizedEmail, code);
    } catch (err) {
      console.warn('EmailService failed to send OTP, fallback to console:', err);
      console.log(`OTP for ${sanitizedEmail}: ${code}`);
    }

    return { message: this.messages.success.otpSent };
  }

  // Email/password login - return JWT on success
  async login(loginInput: LoginInput) {
    // Validate input
    ValidationUtil.validateRequiredFields(loginInput, ['email', 'password']);
    
    const sanitizedEmail = ValidationUtil.sanitizeEmail(loginInput.email);
    
    if (!ValidationUtil.validateEmail(sanitizedEmail)) {
      throw new BadRequestException(this.messages.errors.invalidEmail);
    }
    
    if (!ValidationUtil.validatePassword(loginInput.password)) {
      throw new BadRequestException(this.messages.errors.invalidCredentials);
    }
    
    const sanitizedPassword = ValidationUtil.sanitizeInput(loginInput.password);
    
    const user = await this.validateUser(sanitizedEmail, sanitizedPassword);
    if (!user) {
      throw new UnauthorizedException(this.messages.errors.invalidCredentials);
    }

    // Check if user is active
    if (!user.isActive) {
      // Send OTP for activation
      await this.sendOtp(user.email, 'LOGIN');
      throw new UnauthorizedException(this.messages.errors.accountNotActive);
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
    // Validate input
    ValidationUtil.validateRequiredFields({ email, code }, ['email', 'code']);
    
    if (!ValidationUtil.validateEmail(email)) {
      throw new BadRequestException(this.messages.errors.invalidEmail);
    }
    
    if (!/^\d{6}$/.test(code)) {
      throw new BadRequestException(this.messages.errors.otpInvalid);
    }

    const sanitizedEmail = ValidationUtil.sanitizeEmail(email);
    
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { email: sanitizedEmail } });
    if (!user) {
      throw new BadRequestException(this.messages.errors.userNotFound);
    }

    // Verify OTP
    const otpRow = await (this.prisma as any).oTP.findFirst({ 
      where: { 
        email: sanitizedEmail, 
        code,
        used: false
      }, 
      orderBy: { createdAt: 'desc' } 
    });
    
    if (!otpRow) {
      throw new BadRequestException(this.messages.errors.invalidToken);
    }

    if (new Date() > otpRow.expiresAt) {
      throw new BadRequestException(this.messages.errors.otpExpired);
    }

    // Consume OTP
    await (this.prisma as any).oTP.deleteMany({ where: { email, code } });

    // Update last login
    await this.recordLastLogin(user.id);

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
    // Validate input
    ValidationUtil.validateRequiredFields({ email, code }, ['email', 'code']);
    
    if (!ValidationUtil.validateEmail(email)) {
      throw new BadRequestException(this.messages.errors.invalidEmail);
    }
    
    if (!/^\d{6}$/.test(code)) {
      throw new BadRequestException(this.messages.errors.otpInvalid);
    }

    const sanitizedEmail = ValidationUtil.sanitizeEmail(email);

    // Check OTP table first
    const otpRow = await this.prisma.otp.findFirst({ 
      where: { 
        email: sanitizedEmail, 
        code,
        used: false
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
      throw new BadRequestException(this.messages.errors.otpExpired);
    }

    // Consume OTP(s)
    await (this.prisma as any).oTP.deleteMany({ where: { email, code } });

    // Find user and mark active
    const user = await this.prisma.user.findUnique({ where: { email: sanitizedEmail } });
    if (!user) throw new BadRequestException(this.messages.errors.userNotFound);
    
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
    
    // Validasi email format dengan regex yang lebih ketat
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(userData.email)) {
      throw new BadRequestException('Invalid email format. Please use a valid email address.');
    }
    
    // Sanitasi email
    const sanitizedEmail = userData.email.toLowerCase().trim();
    
    // Validasi panjang email
    if (sanitizedEmail.length > 254) {
      throw new BadRequestException('Email is too long. Maximum 254 characters allowed.');
    }
    
    // Validasi password strength yang lebih ketat
    if (!password || password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      throw new BadRequestException('Password must be less than 128 characters');
    }
    
    // Validasi kompleksitas password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]/;
    if (!passwordRegex.test(password)) {
      throw new BadRequestException('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*(),.?":{}|<>)');
    }
    
    // Validasi karakter yang tidak diizinkan (simbol berbahaya)
    const dangerousChars = /[<>\"'&;|`]/.test(password);
    if (dangerousChars) {
      throw new BadRequestException('Password contains invalid characters. Avoid using: < > \" \' & ; | `');
    }
    
    // Validasi nama (opsional, tapi kalau ada harus valid)
    let sanitizedName: string | null = null;
    if (userData.name && userData.name.trim().length > 0) {
      if (userData.name.length < 2) {
        throw new BadRequestException('Name must be at least 2 characters long');
      }
      
      if (userData.name.length > 50) {
        throw new BadRequestException('Name must be less than 50 characters');
      }
      
      // Validasi karakter nama (hanya huruf, spasi, hyphen, dot, dan apostrophe)
      const nameRegex = /^[a-zA-Z\s\-\.']+$/;
      if (!nameRegex.test(userData.name)) {
        throw new BadRequestException('Name can only contain letters, spaces, hyphens, dots, and apostrophes');
      }
      
      // Sanitasi nama
      sanitizedName = userData.name.replace(/[^a-zA-Z\s\-\.']/g, '').trim();
    }
    
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email: sanitizedEmail } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    
    const saltRounds = parseInt(this.configService.get('auth.bcryptSaltRounds') || '12'); // Naikkan ke 12
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    try {
      const user = await this.prisma.user.create({
        data: {
          email: sanitizedEmail,
          name: sanitizedName || null,
          password: hashedPassword,
          isActive: false, // Default inactive, akan diaktifkan setelah OTP
          role: 'CUSTOMER', // Default role
          phone: userData.phone ? userData.phone.replace(/[^0-9+\-\s]/g, '').trim() : null,
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
    
    // @keamanan Validasi email sebelum query database
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      console.error('Google user data validation failed:', { email, firstName, lastName, picture });
      throw new BadRequestException('Invalid Google profile: email is missing or invalid');
    }
    
    // Validasi format email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format from Google:', email);
      throw new BadRequestException('Invalid Google profile: email format is invalid');
    }
    
    const sanitizedEmail = email.toLowerCase().trim();
    
    let user = await this.prisma.user.findUnique({ where: { email: sanitizedEmail } });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await this.prisma.user.create({
        data: {
          email: sanitizedEmail,
          name: `${firstName || ''} ${lastName || ''}`.trim() || null,
          password: hashedPassword,
          avatar: picture || null,
          phone: null, // optional phone field
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