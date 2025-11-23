import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
      throw new Error('Invalid credentials');
    }
    
    // TODO: Implement JWT token generation
    return {
      access_token: 'placeholder_jwt_token',
      user,
    };
  }

  async register(registerInput: RegisterInput) {
    const { password, ...userData } = registerInput;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    const { password: _, ...result } = user;
    
    // TODO: Implement JWT token generation
    return {
      access_token: 'placeholder_jwt_token',
      user: result,
    };
  }
}