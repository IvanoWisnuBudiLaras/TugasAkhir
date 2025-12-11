import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductRepository extends BaseRepository<any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'product');
  }

  async findBySlug(slug: string) {
    const model = this.getModel();
    return model.findUnique({ where: { slug } });
  }

  async findActiveFeatured(limit = 10) {
    const model = this.getModel();
    return model.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async search(keyword: string, options: any = {}) {
    const model = this.getModel();
    return model.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
          { sku: { contains: keyword, mode: 'insensitive' } },
          { barcode: { contains: keyword, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      ...options,
    });
  }

  async updateStock(productId: string, quantity: number) {
    const model = this.getModel();
    return model.update({
      where: { id: productId },
      data: { stock: { increment: quantity } },
    });
  }

  async setStock(productId: string, stock: number) {
    const model = this.getModel();
    return model.update({
      where: { id: productId },
      data: { stock },
    });
  }
}