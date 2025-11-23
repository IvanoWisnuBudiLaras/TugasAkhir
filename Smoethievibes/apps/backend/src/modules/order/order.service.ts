import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderSubscriptionService } from './order-subscription.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private subscriptionService: OrderSubscriptionService
  ) {}

  async findAll() {
    return this.prisma.order.findMany({
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

  async findOne(id: string) {
    return this.prisma.order.findUnique({
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
  }

  async create(orderData: any) {
    // Hitung total otomatis dari orderItems
    let total = 0;
    
    if (orderData.orderItems && orderData.orderItems.length > 0) {
      // Validasi untuk mencegah duplikasi produk dalam SATU order yang sama
      const productIds = orderData.orderItems.map((item: { productId: string }) => item.productId);
      const uniqueProductIds = [...new Set(productIds)];
      
      if (productIds.length !== uniqueProductIds.length) {
        throw new Error('Produk yang sama tidak boleh muncul lebih dari sekali dalam satu order. Silahkan update jumlah produk tersebut jika ingin menambah quantity.');
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
            throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan`);
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
        throw new Error('Produk yang sama tidak boleh muncul lebih dari sekali dalam satu order.');
      }
    }

    return this.prisma.order.update({
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
  }

  async remove(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
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
        throw new Error('Produk tidak ditemukan');
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

    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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