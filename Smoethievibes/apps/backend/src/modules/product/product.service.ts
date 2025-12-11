import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import Redis from 'ioredis';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  private readonly CACHE_TTL = 300; // 5 menit dalam detik
  
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly categoryService: CategoryService,
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
      // Coba cari berdasarkan ID dulu (untuk backward compatibility)
      let products = await this.prisma.product.findMany({
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

      // Jika tidak ada hasil, coba cari berdasarkan nama kategori (case-insensitive)
      if (products.length === 0) {
        // Cari kategori yang namanya cocok (case-insensitive)
        const category = await this.prisma.category.findFirst({
          where: {
            name: {
              equals: categoryId,
              mode: 'insensitive'
            }
          }
        });

        if (category) {
          // Jika kategori ditemukan, ambil produk dengan categoryId yang sesuai
          products = await this.prisma.product.findMany({
            where: { 
              categoryId: category.id
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
        }
      }

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
      // Transform slug ke format nama kategori (misal: "healthy-food" -> "Healthy Food")
      const formattedCategoryName = categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const products = await this.prisma.product.findMany({
        where: { 
          category: {
            name: {
              equals: formattedCategoryName,
              mode: 'insensitive' // pencarian tidak case-sensitive
            }
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