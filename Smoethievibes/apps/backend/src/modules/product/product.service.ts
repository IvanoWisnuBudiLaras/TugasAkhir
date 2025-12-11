import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class ProductService {
  private readonly CACHE_TTL = 300; // 5 menit dalam detik
  
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {}

  private getCacheKey(type: string, id?: string): string {
    return id ? `products:${type}:${id}` : `products:${type}`;
  }

  async findAll() {
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
      const products = await this.prisma.product.findMany({
        where: { stock: { gt: 0 } },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true
            }
          },
        },
        orderBy: [
          { name: 'asc' }
        ],
        take: 100 // Batasi untuk performa
      });

      // Try to cache the result, but don't fail if Redis is down
      try {
        await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(products));
      } catch (redisCacheError) {
        console.warn('Redis cache set failed:', redisCacheError);
        // Continue without caching
      }

      return products;
    } catch (dbError: any) {
      console.error('Database error in findAll:', dbError);
      throw new Error('Failed to fetch products from database');
    }
  }

  async findOne(id: string) {
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
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true
            }
          },
        },
      });

      if (product) {
        // Try to cache the result, but don't fail if Redis is down
        try {
          await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(product));
        } catch (redisCacheError) {
          console.warn('Redis cache set failed:', redisCacheError);
          // Continue without caching
        }
      }
      
      return product;
    } catch (dbError: any) {
      console.error('Database error in findOne:', dbError);
      throw new Error('Failed to fetch product from database');
    }
  }

  async create(productData: any) {
    try {
      const product = await this.prisma.product.create({
        data: productData,
      });
      
      // Invalidate cache
      await this.invalidateProductCache();
      
      return product;
    } catch (dbError) {
      console.error('Database error in create:', dbError);
      throw new Error('Failed to create product');
    }
  }

  async update(id: string, productData: any) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: productData,
      });
      
      // Invalidate cache
      await this.invalidateProductCache(id);
      
      return product;
    } catch (dbError) {
      console.error('Database error in update:', dbError);
      if ((dbError as any).code === 'P2025') {
        throw new Error('Product not found');
      }
      throw new Error('Failed to update product');
    }
  }

  async remove(id: string) {
    try {
      const product = await this.prisma.product.delete({
        where: { id },
      });
      
      // Invalidate cache
      await this.invalidateProductCache(id);
      
      return product;
    } catch (dbError) {
      console.error('Database error in remove:', dbError);
      if ((dbError as any).code === 'P2025') {
        throw new Error('Product not found');
      }
      throw new Error('Failed to delete product');
    }
  }

  async findByCategory(categoryId: string) {
    const cacheKey = this.getCacheKey('category', categoryId);
    
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
      const products = await this.prisma.product.findMany({
        where: { 
          categoryId
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true
            }
          },
        },
        orderBy: [
          { name: 'asc' }
        ]
      });

      // Try to cache the result, but don't fail if Redis is down
      try {
        await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(products));
      } catch (redisCacheError) {
        console.warn('Redis cache set failed:', redisCacheError);
        // Continue without caching
      }

      return products;
    } catch (dbError) {
      console.error('Database error in findByCategory:', dbError);
      throw new Error('Failed to fetch products by category from database');
    }
  }

  async findByCategorySlug(categorySlug: string) {
    const cacheKey = this.getCacheKey('category-slug', categorySlug);
    
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
      const products = await this.prisma.product.findMany({
        where: { 
          category: {
            name: categorySlug
          }
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              description: true
            }
          },
        },
        orderBy: [
          { name: 'asc' }
        ]
      });

      // Try to cache the result, but don't fail if Redis is down
      try {
        await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(products));
      } catch (redisCacheError) {
        console.warn('Redis cache set failed:', redisCacheError);
        // Continue without caching
      }

      return products;
    } catch (dbError) {
      console.error('Database error in findByCategorySlug:', dbError);
      throw new Error('Failed to fetch products by category slug from database');
    }
  }

  async findAllCategories() {
    const cacheKey = this.getCacheKey('categories');
    
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
          createdAt: true
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
      console.error('Database error in findAllCategories:', dbError);
      throw new Error('Failed to fetch categories from database');
    }
  }

  async findOneCategory(id: string) {
    const cacheKey = this.getCacheKey('category-id', id);
    
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
          createdAt: true
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
      console.error('Database error in findOneCategory:', dbError);
      throw new Error('Failed to fetch category from database');
    }
  }

  async createCategory(categoryData: { name: string; description?: string }) {
    try {
      const category = await this.prisma.category.create({
        data: categoryData,
      });
      
      // Invalidate categories cache
      try {
        await this.redis.del(this.getCacheKey('categories'));
      } catch (redisError) {
        console.warn('Redis cache invalidation failed:', redisError);
        // Continue without cache invalidation
      }
      
      return category;
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Prisma unique constraint violation
        throw new Error(`Category with name "${categoryData.name}" already exists`);
      }
      throw error;
    }
  }

  async updateCategory(id: string, categoryData: { name?: string; description?: string }) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: categoryData,
      });
      
      // Invalidate cache
      try {
        await this.redis.del(this.getCacheKey('categories'));
        await this.redis.del(this.getCacheKey('category-id', id));
      } catch (redisError) {
        console.warn('Redis cache invalidation failed:', redisError);
        // Continue without cache invalidation
      }
      
      return category;
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Prisma unique constraint violation
        throw new Error(`Category with name "${categoryData.name}" already exists`);
      }
      if (error.code === 'P2025') {
        // Prisma record not found
        throw new Error(`Category with id "${id}" not found`);
      }
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      // Check if category is being used by products
      const productsCount = await this.prisma.product.count({
        where: { categoryId: id }
      });

      if (productsCount > 0) {
        throw new Error('Cannot delete category that has products associated with it');
      }

      const category = await this.prisma.category.delete({
        where: { id },
      });
      
      // Invalidate cache
      try {
        await this.redis.del(this.getCacheKey('categories'));
        await this.redis.del(this.getCacheKey('category-id', id));
      } catch (redisError) {
        console.warn('Redis cache invalidation failed:', redisError);
        // Continue without cache invalidation
      }
      
      return category;
    } catch (dbError: any) {
      console.error('Database error in deleteCategory:', dbError);
      if (dbError.code === 'P2025') {
        throw new Error(`Category with id "${id}" not found`);
      }
      throw dbError;
    }
  }

  private async invalidateProductCache(productId?: string) {
    try {
      if (productId) {
        // Invalidate specific product
        await this.redis.del(this.getCacheKey('id', productId));
      }
      
      // Invalidate all product-related caches
      const keys = await this.redis.keys('products:*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (redisError) {
      console.warn('Redis cache invalidation failed:', redisError);
      // Continue without cache invalidation
    }
  }
}