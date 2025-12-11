import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserRepository extends BaseRepository<any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  async findByEmail(email: string) {
    const model = this.getModel();
    return model.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findByEmailWithPassword(email: string) {
    const model = this.getModel();
    return model.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findActiveUsers() {
    const model = this.getModel();
    return model.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLastLogin(userId: string) {
    const model = this.getModel();
    return model.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  async deactivateUser(userId: string) {
    const model = this.getModel();
    return model.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  async activateUser(userId: string) {
    const model = this.getModel();
    return model.update({
      where: { id: userId },
      data: { isActive: true },
    });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    const model = this.getModel();
    return model.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async countByRole(role: string) {
    const model = this.getModel();
    return model.count({
      where: { role },
    });
  }

  async findByRole(role: string, options: any = {}) {
    const model = this.getModel();
    return model.findMany({
      where: { role, isActive: true },
      ...options,
    });
  }
}