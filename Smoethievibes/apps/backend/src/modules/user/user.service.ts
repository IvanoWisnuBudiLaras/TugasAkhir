import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(userData: any) {
    // Cek duplikasi email sebelum membuat user
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('Email sudah terdaftar. Silakan gunakan email lain.');
    }

    return this.prisma.user.create({
      data: userData,
    });
  }

  async update(id: string, userData: any) {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}