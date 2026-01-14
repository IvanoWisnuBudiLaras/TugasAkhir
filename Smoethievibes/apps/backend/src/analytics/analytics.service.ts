import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { UserRole } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Get popular products (Real-time Raw Query)
  async getPopularProducts(limit = 10): Promise<any[]> {
  return this.prisma.$queryRaw<any[]>`
    SELECT 
      p.id, p.name, p.price, p.stock,
      CAST(COALESCE(SUM(oi.quantity), 0) AS INTEGER) as "totalSold",
      CAST(COALESCE(SUM(oi.quantity * oi.price), 0) AS DOUBLE PRECISION) as "totalRevenue",
      -- TAMBAHKAN LINE DI BAWAH INI --
      CAST(CASE WHEN SUM(oi.quantity) > 0 THEN SUM(oi.quantity * oi.price) / SUM(oi.quantity) ELSE 0 END AS DOUBLE PRECISION) as "averagePrice",
      c.name as "categoryName"
    FROM products p
    JOIN categories c ON p."categoryId" = c.id
    LEFT JOIN order_items oi ON p.id = oi."productId"
    LEFT JOIN orders o ON oi."orderId" = o.id 
    WHERE o.status IN ('CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED') OR o.id IS NULL
    GROUP BY p.id, c.name, p.price, p.stock
    ORDER BY "totalSold" DESC
    LIMIT ${limit}
  `;
}

  // 2. Get customer analytics (Real-time Raw Query)
  async getCustomerAnalytics(limit = 10): Promise<any[]> {
    return this.prisma.$queryRaw<any[]>`
      SELECT 
        u.id, u.email, u.name, u.role,
        CAST(COUNT(o.id) AS INTEGER) as "totalOrders",
        CAST(COALESCE(SUM(o.total), 0) AS DOUBLE PRECISION) as "totalSpent",
        CAST(CASE WHEN COUNT(o.id) > 0 THEN SUM(o.total) / COUNT(o.id) ELSE 0 END AS DOUBLE PRECISION) as "avgOrderValue",
        MAX(o."createdAt") as "lastOrderDate",
        CASE 
          WHEN MAX(o."createdAt") IS NULL THEN 'NEW'
          WHEN CURRENT_DATE - DATE(MAX(o."createdAt")) <= 30 THEN 'ACTIVE'
          WHEN CURRENT_DATE - DATE(MAX(o."createdAt")) <= 90 THEN 'REGULAR'
          ELSE 'INACTIVE'
        END as "customerStatus"
      FROM users u
      LEFT JOIN orders o ON u.id = o."userId" AND o.status != 'CANCELLED'
      WHERE u.role = ${UserRole.CUSTOMER}
      GROUP BY u.id
      ORDER BY "totalSpent" DESC
      LIMIT ${limit}
    `;
  }

  // 3. Get inventory alerts
  async getInventoryAlerts(): Promise<any[]> {
    return this.prisma.$queryRaw<any[]>`
      SELECT 
        p.id, p.name, p.stock,
        c.name as "categoryName",
        CASE 
          WHEN p.stock = 0 THEN 'OUT_OF_STOCK'
          WHEN p.stock <= 5 THEN 'LOW_STOCK'
          WHEN p.stock <= 10 THEN 'MEDIUM_STOCK'
          ELSE 'GOOD_STOCK'
        END as "stockStatus",
        CAST(COALESCE((
          SELECT SUM(oi.quantity) 
          FROM order_items oi 
          JOIN orders ord ON oi."orderId" = ord.id 
          WHERE oi."productId" = p.id 
          AND ord.status != 'CANCELLED'
          AND ord."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
        ), 0) AS INTEGER) as "totalSoldLast30Days"
      FROM products p
      JOIN categories c ON p."categoryId" = c.id
      WHERE p.stock <= 10
      ORDER BY p.stock ASC
    `;
  }

  // 4. Get daily summary
  async getDailySummary(startDate?: Date, endDate?: Date): Promise<any[]> {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    return this.prisma.$queryRaw<any[]>`
      SELECT 
        DATE("createdAt") as date,
        CAST(COUNT(*) AS INTEGER) as "totalOrders",
        CAST(SUM(CASE WHEN status != 'CANCELLED' THEN total ELSE 0 END) AS DOUBLE PRECISION) as "totalRevenue",
        CAST(AVG(CASE WHEN status != 'CANCELLED' THEN total ELSE NULL END) AS DOUBLE PRECISION) as "averageOrderValue",
        CAST(COUNT(DISTINCT "userId") AS INTEGER) as "uniqueCustomers"
      FROM orders
      WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
      GROUP BY DATE("createdAt")
      ORDER BY date DESC
    `;
  }

  // 5. Dashboard Stats
  async getDashboardStats() {
    const [totalUsers, totalOrders, revenueResult, todayOrders, pendingOrders, lowStockProducts] = await Promise.all([
      this.prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
      this.prisma.order.count({ where: { status: { not: 'CANCELLED' } } }),
      this.prisma.order.aggregate({
        where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        _sum: { total: true },
      }),
      this.prisma.order.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          status: { not: 'CANCELLED' }
        },
      }),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.product.count({ where: { stock: { lte: 10 } } }),
    ]);

    return {
      totalUsers,
      totalOrders,
      totalRevenue: revenueResult._sum.total || 0,
      todayOrders,
      pendingOrders,
      lowStockProducts,
    };
  }

  // 6. Export to Excel
  async exportToExcel(
    type: 'popular-products' | 'customers' | 'inventory' | 'daily-summary',
    startDate?: Date,
    endDate?: Date
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    let worksheet: ExcelJS.Worksheet;
    let data: any[] = [];

    if (type === 'popular-products') {
      worksheet = workbook.addWorksheet('Produk Populer');
      data = await this.getPopularProducts(100);
      this.populatePopularProductsWorksheet(worksheet, data);
    } else if (type === 'customers') {
      worksheet = workbook.addWorksheet('Pelanggan');
      data = await this.getCustomerAnalytics(100);
      this.populateCustomerAnalyticsWorksheet(worksheet, data);
    } else if (type === 'inventory') {
      worksheet = workbook.addWorksheet('Inventaris');
      data = await this.getInventoryAlerts();
      this.populateInventoryWorksheet(worksheet, data);
    } else if (type === 'daily-summary') {
      worksheet = workbook.addWorksheet('Harian');
      data = await this.getDailySummary(startDate, endDate);
      this.populateDailySummaryWorksheet(worksheet, data);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  // --- Helpers (Wajib ada agar tidak error) ---
  private populatePopularProductsWorksheet(ws: ExcelJS.Worksheet, data: any[]) {
    ws.columns = [
      { header: 'Nama Produk', key: 'name', width: 30 },
      { header: 'Stok', key: 'stock', width: 10 },
      { header: 'Total Terjual', key: 'totalSold', width: 15 },
      { header: 'Pendapatan', key: 'totalRevenue', width: 20 },
    ];
    data.forEach(item => ws.addRow(item));
  }

  private populateCustomerAnalyticsWorksheet(ws: ExcelJS.Worksheet, data: any[]) {
    ws.columns = [
      { header: 'Nama', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Total Belanja', key: 'totalSpent', width: 20 },
      { header: 'Status', key: 'customerStatus', width: 15 },
    ];
    data.forEach(item => ws.addRow(item));
  }

  private populateInventoryWorksheet(ws: ExcelJS.Worksheet, data: any[]) {
    ws.columns = [
      { header: 'Produk', key: 'name', width: 30 },
      { header: 'Stok', key: 'stock', width: 10 },
      { header: 'Status', key: 'stockStatus', width: 20 },
    ];
    data.forEach(item => ws.addRow(item));
  }

  private populateDailySummaryWorksheet(ws: ExcelJS.Worksheet, data: any[]) {
    ws.columns = [
      { header: 'Tanggal', key: 'date', width: 15 },
      { header: 'Total Order', key: 'totalOrders', width: 15 },
      { header: 'Revenue', key: 'totalRevenue', width: 20 },
    ];
    data.forEach(item => ws.addRow(item));
  }
}