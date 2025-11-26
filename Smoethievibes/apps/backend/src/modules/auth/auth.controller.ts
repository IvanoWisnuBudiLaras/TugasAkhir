import { Controller, Post, Body, Get, UseGuards, Req, Res, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginInput) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterInput) {
    return this.authService.register(registerDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const { access_token } = req.user;
    res.redirect(`http://localhost:3000/auth/callback?token=${access_token}`);
  }

  @Get('status')
  async getAuthStatus() {
    return { status: 'Auth module is working' };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@CurrentUser() user: any) {
    return user;
  }

  @Patch('complete-profile')
  @UseGuards(AuthGuard('jwt'))
  async completeProfile(
    @CurrentUser() user: any,
    @Body() profileData: { name?: string; phone?: string; address?: string; avatar?: string },
  ) {
    return this.authService.completeProfile(user.sub, profileData);
  }

  @Patch('update-profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @CurrentUser() user: any,
    @Body() profileData: { name?: string; phone?: string; address?: string; avatar?: string },
  ) {
    return this.authService.updateProfile(user.sub, profileData);
  }
}