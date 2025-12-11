import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class UserService {
  private readonly CACHE_TTL = 300; // 5 menit

  constructor(
    private prisma: PrismaService,
    @Inject(ConfigService)
    private configService: ConfigService,
    @Inject('REDIS_CLIENT')
    private redisClient: Redis,
  ) {}

  private getCacheKey(prefix: string, id?: string): string {
    return id ? `user:${prefix}:${id}` : `user:${prefix}`;
  }

  private async invalidateUserCache(userId?: string) {
    const keys = userId 
      ? [`user:all`, `user:single:${userId}`]
      : [`user:all`];
    
    for (const key of keys) {
      await this.redisClient.del(key);
    }
  }

  async findAll() {
    const cacheKey = this.getCacheKey('all');
    const cached = await this.redisClient.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const users = await this.prisma.user.findMany();
    await this.redisClient.setex(cacheKey, this.CACHE_TTL, JSON.stringify(users));
    return users;
  }

  async findOne(id: string, useCache: boolean = true) {
    // Skip cache if useCache is false
    if (useCache) {
      const cacheKey = this.getCacheKey('single', id);
      const cached = await this.redisClient.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (user && useCache) {
      await this.redisClient.setex(this.getCacheKey('single', id), this.CACHE_TTL, JSON.stringify(user));
    }
    
    return user;
  }

  async create(userData: any) {
    // Cek duplikasi email sebelum membuat user
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error(this.configService.get('messages.errors.userExists'));
    }

    const user = await this.prisma.user.create({
      data: userData,
    });

    // Invalidate cache
    await this.invalidateUserCache();

    return user;
  }

  async update(id: string, userData: any) {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: userData,
    });

    // Invalidate cache
    await this.invalidateUserCache(id);

    return updatedUser;
  }

  async remove(id: string) {
    const result = await this.prisma.user.delete({
      where: { id },
    });

    // Invalidate cache
    await this.invalidateUserCache(id);

    return result;
  }
}