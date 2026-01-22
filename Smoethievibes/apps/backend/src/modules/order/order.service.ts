import { Injectable, Inject, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderSubscriptionService } from './order-subscription.service';
import Redis from 'ioredis';
import { string } from 'zod';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  private readonly CACHE_TTL = 300;

  constructor(
    private prisma: PrismaService,
    private subscriptionService: OrderSubscriptionService,
    @Inject('REDIS_CLIENT')
    private redisClient: Redis,
  ) {}

  // --- PRIVATE HELPERS ---

  private getCacheKey(prefix: string, id?: string): string {
    return id ? `order:${prefix}:${id}` : `order:${prefix}`;
  }

  private async invalidateOrderCache(orderId?: string, userId?: string) {
    const pipeline = this.redisClient.pipeline();
    pipeline.del(this.getCacheKey('all'));
    if (orderId) pipeline.del(this.getCacheKey('single', orderId));
    if (userId) pipeline.del(this.getCacheKey(`user:${userId}`));
    
    // Hapus semua cache list user jika userId tidak spesifik
    if (!userId) {
      const keys = await this.redisClient.keys('order:user:*');
      if (keys.length > 0) pipeline.del(...keys);
    }
    await pipeline.exec();
  }

  /**
   * Logika sinkronisasi ke tabel Analytics
   */
  private async updateAnalyticsInternal(tx: any, order: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. User Analytics
    await tx.userAnalytics.upsert({
      where: { userId: order.userId },
      create: {
        id: uuidv4(), // <--- Memberikan ID manual
        userId: order.userId,
        totalOrders: 1,
        totalSpent: order.total,
        lastOrderDate: new Date(),
        firstOrderDate: new Date(),
        averageOrderValue: order.total,
        updatedAt: new Date(), // <--- Memberikan updatedAt manual
      },
      update: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: order.total },
        lastOrderDate: new Date(),
        updatedAt: new Date(),
      },
    });

    // 2. Product Analytics
    for (const item of order.orderItems) {
      await tx.productAnalytics.upsert({
        where: { productId: item.productId },
        create: {
          id: uuidv4(), // <--- Memberikan ID manual
          productId: item.productId,
          totalSold: item.quantity,
          totalRevenue: item.price * item.quantity,
          lastSoldDate: new Date(),
          updatedAt: new Date(),
        },
        update: {
          totalSold: { increment: item.quantity },
          totalRevenue: { increment: item.price * item.quantity },
          lastSoldDate: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // 3. Daily Order Summary
    await tx.dailyOrderSummary.upsert({
      where: { date: today },
      create: {
        id: uuidv4(), // <--- Memberikan ID manual
        date: today,
        totalOrders: 1,
        totalRevenue: order.total,
        takeawayOrders: order.orderType === 'TAKEAWAY' ? 1 : 0,
        dineInOrders: order.orderType === 'DINE_IN' ? 1 : 0,
        deliveryOrders: order.orderType === 'DELIVERY' ? 1 : 0,
        updatedAt: new Date(),
      },
      update: {
        totalOrders: { increment: 1 },
        totalRevenue: { increment: order.total },
        takeawayOrders: order.orderType === 'TAKEAWAY' ? { increment: 1 } : undefined,
        dineInOrders: order.orderType === 'DINE_IN' ? { increment: 1 } : undefined,
        deliveryOrders: order.orderType === 'DELIVERY' ? { increment: 1 } : undefined,
        updatedAt: new Date(),
      },
    });
  }
  // --- PUBLIC METHODS ---

  async findAll() {
    const cacheKey = this.getCacheKey('all');
    const cached = await this.redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const orders = await this.prisma.order.findMany({
      include: { user: true, orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
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
      include: { user: true, orderItems: { include: { product: true } } },
    });

    if (!order) throw new NotFoundException(`Order ID ${id} tidak ditemukan`);
    await this.redisClient.setex(cacheKey, this.CACHE_TTL, JSON.stringify(order));
    return order;
  }

  async create(orderData: any) {
    const { orderItems, userId, tableNumber, ...restOfData } = orderData;

    if (!orderItems?.length) throw new BadRequestException('Keranjang belanja kosong');

    try {
      return await this.prisma.$transaction(async (tx) => {
        let total = 0;
        const itemsToCreate = [];

        for (const item of orderItems) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product) throw new NotFoundException(`Produk ${item.productId} tidak ditemukan`);

          const qty = Number(item.quantity);
          if (product.stock < qty) throw new BadRequestException(`Stok ${product.name} tidak cukup`);

          // POTONG STOK
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: qty } },
          });

          total += product.price * qty;
          itemsToCreate.push({
            productId: product.id,
            quantity: qty,
            price: product.price,
          });
        }

        const order = await tx.order.create({
          data: {
            ...restOfData,
            userId,
            tableNumber: tableNumber ? Number(tableNumber) : null,
            total,
            orderItems: { create: itemsToCreate },
          },
          include: { orderItems: true },
        });

        // UPDATE ANALYTICS
        await this.updateAnalyticsInternal(tx, order);

        await this.invalidateOrderCache(undefined, userId);
        await this.subscriptionService.publishOrderCreated(order);
        return order;
      });
    } catch (error: any) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal membuat pesanan: ' + error.message);
    }
  }

  async updateStatus(id: string, status: any) {
    return await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { orderItems: true },
      });
      if (!order) throw new NotFoundException('Order tidak ditemukan');

      // KEMBALIKAN STOK JIKA CANCEL
      if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
        for (const item of order.orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
        
        // Update Daily Summary (menambah jumlah pembatalan)
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        await tx.dailyOrderSummary.upsert({
          where: { date: orderDate },
          create: { date: orderDate, cancelledOrders: 1 },
          update: { cancelledOrders: { increment: 1 } },
        });
      }

      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status },
        include: { user: true, orderItems: { include: { product: true } } },
      });

      await this.invalidateOrderCache(id, order.userId);
      return updatedOrder;
    });
  }

  async update(id: string, orderData: any) {
    const { tableNumber, ...restOfData } = orderData;
    
    // Cari order untuk memastikan keberadaannya
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order tidak ditemukan');

    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          ...restOfData,
          tableNumber: tableNumber ? Number(tableNumber) : null,
        },
        include: { user: true }
      });

      // Invalidate cache agar data yang diupdate langsung sinkron
      await this.invalidateOrderCache(id, updatedOrder.userId);
      return updatedOrder;
    } catch (error) {
      throw new InternalServerErrorException('Gagal memperbarui order');
    }
  }
  async remove(id: string) {
    return await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { orderItems: true },
      });
      if (!order) throw new NotFoundException('Order tidak ditemukan');

      // BALIKIN STOK JIKA ORDER DIHAPUS SAAT MASIH AKTIF
      if (order.status !== 'CANCELLED') {
        for (const item of order.orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      await tx.orderItem.deleteMany({ where: { orderId: id } });
      const result = await tx.order.delete({ where: { id } });

      await this.invalidateOrderCache(id, order.userId);
      return result;
    });
  }

  async addOrUpdateOrderItem(orderId: string, productId: any, quantity: number) {
    return await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new NotFoundException('Produk tidak ditemukan');

      if (product.stock < quantity) throw new BadRequestException('Stok tidak mencukupi');

      const existingItem = await tx.orderItem.findFirst({
        where: { orderId, productId },
      });

      if (existingItem) {
        await tx.orderItem.update({
          where: { id: existingItem.id },
          data: { quantity: { increment: Number(quantity) } },
        });
      } else {
        await tx.orderItem.create({
          data: { orderId, productId, quantity: Number(quantity), price: product.price },
        });
      }

      // UPDATE STOK & REKALKULASI
      await tx.product.update({
        where: { id: productId },
        data: { stock: { decrement: Number(quantity) } },
      });

      return await this.recalculateOrderTotalInternal(tx, orderId);
    });
  }

  async removeOrderItem(orderId: string, orderItemId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const item = await tx.orderItem.findUnique({ where: { id: orderItemId } });
      if (!item) throw new NotFoundException('Item tidak ditemukan');

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });

      await tx.orderItem.delete({ where: { id: orderItemId } });
      return await this.recalculateOrderTotalInternal(tx, orderId);
    });
  }

  private async recalculateOrderTotalInternal(tx: any, orderId: string) {
    const orderItems = await tx.orderItem.findMany({ where: { orderId } });
    const total = orderItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { total },
      include: { user: true, orderItems: { include: { product: true } } },
    });

    await this.invalidateOrderCache(orderId, updatedOrder.userId);
    return updatedOrder;
  }

  async findByUser(userId: string) {
    const cacheKey = this.getCacheKey(`user:${userId}`);
    const cached = await this.redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });

    await this.redisClient.setex(cacheKey, this.CACHE_TTL, JSON.stringify(orders));
    return orders;
  }
}