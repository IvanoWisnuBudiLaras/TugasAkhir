import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats() {
        const totalUsers = await this.prisma.user.count();
        const totalProducts = await this.prisma.product.count();
        const totalOrders = await this.prisma.order.count();

        const revenueResult = await this.prisma.order.aggregate({
            _sum: {
                total: true,
            },
            where: {
                status: {
                    notIn: [OrderStatus.CANCELLED, OrderStatus.REFUNDED],
                },
            },
        });
        const totalRevenue = revenueResult._sum.total || 0;

        return {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
        };
    }
}
