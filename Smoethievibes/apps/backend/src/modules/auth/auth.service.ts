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
  ValidationUtil.validateRequiredFields({ email, code }, ['email', 'code']);
  const sanitizedEmail = ValidationUtil.sanitizeEmail(email);

  // 1. Cari di tabel 'otp' berdasarkan skema baru Anda
  const otpRow = await this.prisma.otp.findFirst({ 
    where: { 
      email: sanitizedEmail, 
      code,
      used: false
    }, 
    orderBy: { createdAt: 'desc' } 
  });
  
  if (!otpRow) {
    throw new BadRequestException('OTP tidak valid atau sudah digunakan.');
  }

  if (new Date() > otpRow.expiresAt) {
    throw new BadRequestException('OTP sudah kadaluwarsa.');
  }

  // 2. Tandai OTP sudah digunakan
  await this.prisma.otp.update({
    where: { id: otpRow.id },
    data: { used: true }
  });

  // 3. Update User (Hapus properti otpCode & otpExpiresAt karena tidak ada di tabel User)
  const user = await this.prisma.user.update({ 
    where: { email: sanitizedEmail }, 
    data: { 
      isActive: true, 
      lastLogin: new Date()
    } 
  });

  const payload = { 
    sub: user.id, 
    email: user.email, 
    roles: user.role, // Role ADMIN/CUSTOMER tetap aman di sini
    iss: this.configService.get('auth.token.issuer'), 
    aud: this.configService.get('auth.token.audience') 
  };
  
  const accessToken = this.jwtService.sign(payload);
  const { password, ...result } = user;
  return { access_token: accessToken, user: result };
}
  // Register new user (email/password)
  async register(registerInput: RegisterInput) {
  // ... (kode validasi password & nama Anda yang sudah ada) ...

  const sanitizedEmail = registerInput.email.toLowerCase().trim();
  const hashedPassword = await bcrypt.hash(registerInput.password, 12);

  try {
    const user = await this.prisma.user.create({
      data: {
        email: sanitizedEmail,
        name: registerInput.name || null,
        password: hashedPassword,
        isActive: false, 
        role: 'CUSTOMER', // Secara default daftar sebagai CUSTOMER
        phone: registerInput.phone || null,
      },
    });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    // SIMPAN KE TABEL OTP (Bukan tabel User)
    await this.prisma.otp.create({
      data: {
        email: user.email,
        code: otp,
        expiresAt: otpExpiresAt,
        action: 'REGISTER'
      },
    });

    await this.emailService.sendOtp(user.email, otp);

    return { message: 'Registrasi berhasil. Silakan cek email untuk verifikasi.', email: user.email };
  } catch (error: any) {
    throw new BadRequestException(error.message);
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