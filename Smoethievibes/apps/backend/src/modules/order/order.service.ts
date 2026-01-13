import { Injectable, Inject, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderSubscriptionService } from './order-subscription.service';
import Redis from 'ioredis';

@Injectable()
export class OrderService {
  private readonly CACHE_TTL = 300;

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
      : [`order:all`, `order:user:*` ];
    
    for (const key of keys) {
      if (key.includes('*')) {
        const matchingKeys = await this.redisClient.keys(key);
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
    if (cached) return JSON.parse(cached);

    const orders = await this.prisma.order.findMany({
      include: {
        user: true,
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    await this.redisClient.setex(cacheKey, this.CACHE_TTL, JSON.stringify(orders));
    return orders;
  }

  async findOne(id: string) {
    const cacheKey = this.getCacheKey('single', id);
    const cached = await this.redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: { include: { product: true } },
      },
    });

    if (!order) throw new NotFoundException(`Order ID ${id} tidak ditemukan`);
    await this.redisClient.setex(cacheKey, this.CACHE_TTL, JSON.stringify(order));
    return order;
  }

  async create(orderData: any) {
    try {
      let total = 0;
      const { orderItems, tableNumber, ...restOfData } = orderData;

      if (!orderItems || orderItems.length === 0) {
        throw new BadRequestException('Keranjang belanja tidak boleh kosong');
      }

      const productIds = orderItems.map((item: any) => item.productId);
      if (productIds.length !== [...new Set(productIds)].length) {
        throw new BadRequestException('Terdapat produk duplikat dalam keranjang');
      }

      const itemsToCreate = [];
      for (const item of orderItems) {
        const pId = isNaN(Number(item.productId)) ? item.productId : Number(item.productId);
        const product = await this.prisma.product.findUnique({ where: { id: pId } });

        if (!product) {
          throw new NotFoundException(`Produk ID ${item.productId} tidak ditemukan`);
        }

        total += product.price * item.quantity;
        itemsToCreate.push({
          productId: pId,
          quantity: Number(item.quantity),
          price: product.price,
        });
      }

      const order = await this.prisma.order.create({
        data: {
          ...restOfData,
          orderType: restOfData.orderType as any,
          tableNumber: tableNumber ? Number(tableNumber) : null,
          total,
          orderItems: { create: itemsToCreate },
        },
        include: {
          user: true,
          orderItems: { include: { product: true } },
        },
      });

      await this.invalidateOrderCache();
      await this.subscriptionService.publishOrderCreated(order);

      return order;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Gagal membuat pesanan');
    }
  }

  async updateStatus(id: string, status: any) {
  const order = await this.prisma.order.findUnique({ where: { id } });
  if (!order) throw new NotFoundException('Order tidak ditemukan');

  const updatedOrder = await this.prisma.order.update({
    where: { id },
    data: { status },
    include: {
      user: true,
      orderItems: { include: { product: true } },
    },
  });

  // WAJIB: Hapus cache agar user melihat status terbaru
  await this.invalidateOrderCache(id);
  
  // Tambahan: Jika Anda menyimpan cache per user, hapus juga
  if (order.userId) {
    const userCacheKey = `order:user:${order.userId}`;
    await this.redisClient.del(userCacheKey);
  }

  return updatedOrder;
}

  async update(id: string, orderData: any) {
    const { orderItems, tableNumber, ...restOfData } = orderData;

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        ...restOfData,
        orderType: restOfData.orderType?.replace('_', '') as any,
        tableNumber: tableNumber ? Number(tableNumber) : null,
      },
      include: {
        user: true,
        orderItems: { include: { product: true } },
      },
    });

    await this.invalidateOrderCache(id);
    return updatedOrder;
  }

  async remove(id: string) {
    await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
    const result = await this.prisma.order.delete({ where: { id } });
    await this.invalidateOrderCache(id);
    return result;
  }

  async findByUser(userId: string) {
    const cacheKey = this.getCacheKey(`user:${userId}`);
    const cached = await this.redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    await this.redisClient.setex(cacheKey, this.CACHE_TTL, JSON.stringify(orders));
    return orders;
  }

  private async recalculateOrderTotal(orderId: string) {
    const orderItems = await this.prisma.orderItem.findMany({ where: { orderId } });
    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return this.prisma.order.update({
      where: { id: orderId },
      data: { total },
      include: {
        user: true,
        orderItems: { include: { product: true } },
      },
    });
  }
}