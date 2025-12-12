import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { REDIS_CLIENT } from '../../common/redis/redis.module';
import Redis from 'ioredis';
import { Category } from './category.model';

@Injectable()
export class CategoryService {
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  private getCacheKey(...parts: string[]): string {
    return `category:${parts.join(':')}`;
  }

  async findAll(): Promise<Category[]> {
    const cacheKey = this.getCacheKey('all');
    
    // Try to get from cache first
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (redisError) {
      console.warn('Redis cache get failed, falling back to database:', redisError);
      // Continue to database if Redis fails
    }

    try {
      const categories = await this.prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true
        }
      });

      // Try to cache the result, but don't fail if Redis is down
      try {
        await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(categories));
      } catch (redisCacheError) {
        console.warn('Redis cache set failed:', redisCacheError);
        // Continue without caching
      }

      return categories;
    } catch (dbError) {
      console.error('Database error in findAll:', dbError);
      throw new Error('Failed to fetch categories from database');
    }
  }

  async findOne(id: string): Promise<Category | null> {
    const cacheKey = this.getCacheKey('id', id);
    
    // Try to get from cache first
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (redisError) {
      console.warn('Redis cache get failed, falling back to database:', redisError);
      // Continue to database if Redis fails
    }

    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (category) {
        // Try to cache the result, but don't fail if Redis is down
        try {
          await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(category));
        } catch (redisCacheError) {
          console.warn('Redis cache set failed:', redisCacheError);
          // Continue without caching
        }
      }
      
      return category;
    } catch (dbError) {
      console.error('Database error in findOne:', dbError);
      throw new Error('Failed to fetch category from database');
    }
  }

  async create(data: { name: string; description?: string }): Promise<Category> {
    try {
      const category = await this.prisma.category.create({
        data,
      });
      
      // Invalidate categories cache
      try {
        await this.redis.del(this.getCacheKey('all'));
      } catch (redisError) {
        console.warn('Redis cache invalidation failed:', redisError);
        // Continue without cache invalidation
      }
      
      return category;
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Prisma unique constraint violation
        throw new HttpException(
          `Category with name "${data.name}" already exists`,
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  async update(id: string, data: { name?: string; description?: string }): Promise<Category> {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data,
      });
      
      // Invalidate cache
      try {
        await this.redis.del(this.getCacheKey('all'));
        await this.redis.del(this.getCacheKey('id', id));
      } catch (redisError) {
        console.warn('Redis cache invalidation failed:', redisError);
        // Continue without cache invalidation
      }
      
      return category;
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Prisma unique constraint violation
        throw new HttpException(
          `Category with name "${data.name}" already exists`,
          HttpStatus.CONFLICT,
        );
      }
      if (error.code === 'P2025') {
        // Prisma record not found
        throw new HttpException(
          `Category with id "${id}" not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Category> {
    try {
      // Check if category is being used by products
      const productsCount = await this.prisma.product.count({
        where: { categoryId: id }
      });

      if (productsCount > 0) {
        throw new HttpException(
          'Cannot delete category that has products',
          HttpStatus.CONFLICT,
        );
      }

      const category = await this.prisma.category.delete({
        where: { id },
      });
      
      // Invalidate cache
      try {
        await this.redis.del(this.getCacheKey('all'));
        await this.redis.del(this.getCacheKey('id', id));
      } catch (redisError) {
        console.warn('Redis cache invalidation failed:', redisError);
        // Continue without cache invalidation
      }
      
      return category;
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Prisma record not found
        throw new HttpException(
          `Category with id "${id}" not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }
}