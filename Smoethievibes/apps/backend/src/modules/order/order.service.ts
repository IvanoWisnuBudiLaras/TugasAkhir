import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderSubscriptionService } from './order-subscription.service';
import Redis from 'ioredis';

@Injectable()
export class OrderService {
  private readonly CACHE_TTL = 300; // 5 menit

  constructor(
    private prisma: PrismaService,
    private subscriptionService: OrderSubscriptionService,
    @Inject(ConfigService)
    private configService: ConfigService,
    @Inject('REDIS_CLIENT')
    private redisClient: Redis,
  ) {}

  private getCacheKey(prefix: string, id?: string): string {
    return id ? `order:${prefix}:${id}` : `order:${prefix}`;
  }

  private async invalidateOrderCache(orderId?: string) {
    const keys = orderId 
      ? [`order:all`, `order:single:${orderId}`, `order:user:*`]
      : [`order:all`, `order:user:*`];
    
    for (const key of keys) {
      if (key.includes('*')) {
        const pattern = key;
        const matchingKeys = await this.redisClient.keys(pattern);
        if (matchingKeys.length > 0) {
          await this.redisClient.del(...matchingKeys);
        }
      } else {
        await this.redisClient.del(key);
      }
    }
  }

  async findAll() {
    const cacheKey = this.getCacheKey('all');
    const cached = await this.redisClient.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const orders = await this.prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    await this.redisClient.setex(cacheKey, this.CACHE_TTL, JSON.stringify(orders));
    return orders;
  }

  async findOne(id: string) {
    const cacheKey = this.getCacheKey('single', id);
    const cached = await this.redisClient.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (order) {
      await this.redisClient.setex(cacheKey, this.CACHE_TTL, JSON.stringify(order));
    }
    
    return order;
  }

  async create(orderData: any) {
    // Hitung total otomatis dari orderItems
    let total = 0;
    
    if (orderData.orderItems && orderData.orderItems.length > 0) {
      // Validasi untuk mencegah duplikasi produk dalam SATU order yang sama
      const productIds = orderData.orderItems.map((item: { productId: string }) => item.productId);
      const uniqueProductIds = [...new Set(productIds)];
      
      if (productIds.length !== uniqueProductIds.length) {
        throw new Error(this.configService.get('messages.errors.duplicateProductInOrderWithHelp'));
      }

      // Hitung total dari orderItems
      for (const item of orderData.orderItems) {
        if (item.price) {
          total += item.price * item.quantity;
        } else {
          // Ambil harga dari database jika tidak ada custom price
          const product = await this.prisma.product.findUnique({
            where: { id: item.productId },
          });
          if (!product) {
            const message = this.configService.get('messages.errors.productNotFoundInOrder');
            throw new Error(message.replace('${productId}', item.productId));
          }
          total += product.price * item.quantity;
          item.price = product.price; // Set harga untuk disimpan
        }
      }
    }

    const order = await this.prisma.order.create({
      data: {
        ...orderData,
        total,
        orderItems: {
          create: orderData.orderItems,
        },
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Invalidate cache
    await this.invalidateOrderCache();

    // Publish order created event
    await this.subscriptionService.publishOrderCreated(order);

    return order;
  }

  async update(id: string, orderData: any) {
    // Jika ada update orderItems, validasi duplikasi juga
    if (orderData.orderItems && orderData.orderItems.length > 0) {
      const productIds = orderData.orderItems.map((item: { productId: string }) => item.productId);
      const uniqueProductIds = [...new Set(productIds)];
      
      if (productIds.length !== uniqueProductIds.length) {
        throw new Error(this.configService.get('messages.errors.duplicateProductInOrder'));
      }
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: orderData,
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Invalidate cache
    await this.invalidateOrderCache(id);

    return updatedOrder;
  }

  async remove(id: string) {
    const result = await this.prisma.order.delete({
      where: { id },
    });

    // Invalidate cache
    await this.invalidateOrderCache(id);

    return result;
  }

  async findByUser(userId: string) {
    const cacheKey = this.getCacheKey(`user:${userId}`);
    const cached = await this.redisClient.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    await this.redisClient.setex(cacheKey, this.CACHE_TTL, JSON.stringify(orders));
    return orders;
  }

  async addOrUpdateOrderItem(orderId: string, productId: string, quantity: number) {
    // Cek apakah orderItem sudah ada untuk produk ini
    const existingItem = await this.prisma.orderItem.findFirst({
      where: {
        orderId,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity jika sudah ada
      return this.prisma.orderItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      });
    } else {
      // Buat baru jika belum ada
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error(this.configService.get('messages.errors.productNotFound'));
      }

      return this.prisma.orderItem.create({
        data: {
          orderId,
          productId,
          quantity,
          price: product.price,
        },
        include: {
          product: true,
        },
      });
    }
  }

  async removeOrderItem(orderId: string, orderItemId: string) {
    // Hapus order item
    await this.prisma.orderItem.delete({
      where: { id: orderItemId },
    });

    // Hitung ulang total
    const orderItems = await this.prisma.orderItem.findMany({
      where: { orderId },
    });

    const total = orderItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Update total order
    return this.prisma.order.update({
      where: { id: orderId },
      data: { total },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}