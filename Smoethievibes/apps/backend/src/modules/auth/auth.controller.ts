import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  Patch,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(@Body() loginInput: LoginInput) {
    try {
      const result = await this.authService.login(loginInput);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Login failed');
    }
  }

  @Post('register')
  async register(@Body() registerInput: RegisterInput) {
    try {
      const result = await this.authService.register(registerInput);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Registration failed');
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; code: string }) {
    try {
      const result = await this.authService.verifyOtp(body.email, body.code);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('OTP verification failed');
    }
  }

  @Post('send-otp')
  async sendOtp(@Body() body: { email: string; action?: 'LOGIN' | 'REGISTER' }) {
    try {
      const result = await this.authService.sendOtp(body.email, body.action);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to send OTP');
    }
  }

  @Post('login-with-otp')
  async loginWithOtp(@Body() body: { email: string; code: string }) {
    try {
      const result = await this.authService.loginWithOtp(body.email, body.code);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Login with OTP failed');
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@CurrentUser() user: any) {
    console.log('Fetching profile for user:', user.sub);
    const profile = await this.authService.getMe(user.sub);
    if (!profile) {
      console.error('Profile not found for user:', user.sub);
      throw new BadRequestException('Profile not found');
    }
    return {
      success: true,
      data: profile,
    };
  }

  @Patch('complete-profile')
  @UseGuards(AuthGuard('jwt'))
  async completeProfile(
    @CurrentUser() user: any,
    @Body() profileData: { name?: string; phone?: string; address?: string; avatar?: string },
  ) {
    try {
      const result = await this.authService.completeProfile(user.sub, profileData);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to complete profile');
    }
  }

  @Patch('update-profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @CurrentUser() user: any,
    @Body() profileData: { name?: string; phone?: string; address?: string; avatar?: string },
  ) {
    try {
      const result = await this.authService.updateProfile(user.sub, profileData);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update profile');
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@CurrentUser() user: any) {
    try {
      const result = await this.authService.recordLastLogin(user.sub);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Logout failed');
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // Google OAuth will handle this
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.authService.validateGoogleUser(req.user);
      
      // Redirect to frontend with token
      const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${result.access_token}`;
      
      return res.redirect(redirectUrl);
    } catch (error) {
      const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback?error=google_auth_failed`;
      
      return res.redirect(redirectUrl);
    }
  }

  @Get('check-email')
  async checkEmail(@Query() query: { email: string }) {
    try {
      const result = await this.authService.checkEmailExists(query.email);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to check email');
    }
  }
}