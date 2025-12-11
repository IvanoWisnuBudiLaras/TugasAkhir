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
    try {
      const cacheKey = this.getCacheKey('all');
      
      // Try to get from cache first
      try {
        const cached = await this.redisClient.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (redisError) {
        console.warn('Redis cache get failed, falling back to database:', redisError);
        // Continue to database if Redis fails
      }

      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      // Try to cache the result, but don't fail if Redis is down
      try {
        await this.redisClient.setex(cacheKey, this.CACHE_TTL, JSON.stringify(users));
      } catch (redisCacheError) {
        console.warn('Redis cache set failed:', redisCacheError);
        // Continue without caching
      }

      return users;
    } catch (dbError) {
      console.error('Database error in findAll:', dbError);
      throw new Error('Failed to fetch users from database');
    }
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