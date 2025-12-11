import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  // Get popular products with sales data
  async getPopularProducts(limit = 10): Promise<any[]> {
    return this.prisma.$queryRaw<any[]>`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.stock,
        COALESCE(pa."totalSold", 0) as "totalSold",
        COALESCE(pa."totalRevenue", 0) as "totalRevenue",
        c.name as "categoryName"
      FROM products p
      JOIN categories c ON p."categoryId" = c.id
      LEFT JOIN product_analytics pa ON p.id = pa."productId"
      ORDER BY COALESCE(pa."totalSold", 0) DESC
      LIMIT ${limit}
    `;
  }

  // Get customer analytics
  async getCustomerAnalytics(limit = 10): Promise<any[]> {
    return this.prisma.$queryRaw<any[]>`
      SELECT 
        u.id,
        u.email,
        u.name,
        u.role,
        COALESCE(ua."totalOrders", 0) as "totalOrders",
        COALESCE(ua."totalSpent", 0) as "totalSpent",
        COALESCE(ua."averageOrderValue", 0) as "avgOrderValue",
        ua."lastOrderDate" as "lastOrderDate",
        CASE 
          WHEN ua."lastOrderDate" IS NULL THEN 'NEW'
          WHEN CURRENT_DATE - DATE(ua."lastOrderDate") <= 30 THEN 'ACTIVE'
          WHEN CURRENT_DATE - DATE(ua."lastOrderDate") <= 90 THEN 'REGULAR'
          ELSE 'INACTIVE'
        END as "customerStatus"
      FROM users u
      LEFT JOIN user_analytics ua ON u.id = ua."userId"
      ORDER BY COALESCE(ua."totalSpent", 0) DESC
      LIMIT ${limit}
    `;
  }

  // Get inventory alerts
  async getInventoryAlerts(): Promise<any[]> {
    return this.prisma.$queryRaw<any[]>`
      SELECT 
        p.id,
        p.name,
        p.stock,
        c.name as "categoryName",
        CASE 
          WHEN p.stock = 0 THEN 'OUT_OF_STOCK'
          WHEN p.stock <= 5 THEN 'LOW_STOCK'
          WHEN p.stock <= 10 THEN 'MEDIUM_STOCK'
          ELSE 'GOOD_STOCK'
        END as "stockStatus",
        COALESCE(pa."totalSold", 0) as "totalSoldLast30Days"
      FROM products p
      JOIN categories c ON p."categoryId" = c.id
      LEFT JOIN product_analytics pa ON p.id = pa."productId"
      WHERE p.stock <= 10
      ORDER BY p.stock ASC, COALESCE(pa."totalSold", 0) DESC
    `;
  }

  // Get daily summary for dashboard
  async getDailySummary(startDate?: Date, endDate?: Date): Promise<any[]> {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const end = endDate || new Date();

    return this.prisma.$queryRaw<any[]>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as "totalOrders",
        SUM("totalAmount") as "totalRevenue",
        AVG("totalAmount") as "averageOrderValue",
        COUNT(DISTINCT "userId") as "uniqueCustomers"
      FROM orders
      WHERE "createdAt" >= ${start} AND "createdAt" <= ${end}
      GROUP BY DATE("createdAt")
      ORDER BY date DESC
    `;
  }

  // Get dashboard stats
  async getDashboardStats() {
    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      todayOrders,
      pendingOrders,
      lowStockProducts,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { total: true },
      }),
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      this.prisma.order.count({
        where: { status: 'PENDING' },
      }),
      this.prisma.product.count({
        where: { stock: { lte: 10 } },
      }),
    ]);

    return {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      todayOrders,
      pendingOrders,
      lowStockProducts,
    };
  }

  // Update product analytics manually (for existing data)
  async updateProductAnalytics() {
    return this.prisma.$executeRaw`
      INSERT INTO product_analytics ("productId", "totalSold", "totalRevenue", "updatedAt")
      SELECT 
        p.id,
        COALESCE(SUM(oi.quantity), 0),
        COALESCE(SUM(oi.quantity * oi.price), 0),
        CURRENT_TIMESTAMP
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi."productId"
      LEFT JOIN orders o ON oi."orderId" = o.id AND o.status != 'CANCELLED'
      GROUP BY p.id
      ON CONFLICT("productId") DO UPDATE SET
        "totalSold" = EXCLUDED."totalSold",
        "totalRevenue" = EXCLUDED."totalRevenue",
        "updatedAt" = EXCLUDED."updatedAt"
    `;
  }

  // Update user analytics manually (for existing data)
  async updateUserAnalytics() {
    return this.prisma.$executeRaw`
      INSERT INTO user_analytics ("userId", "totalOrders", "totalSpent", "lastOrderDate", "firstOrderDate", "averageOrderValue", "updatedAt")
      SELECT 
        u.id,
        COALESCE(COUNT(o.id), 0),
        COALESCE(SUM(o.total), 0),
        MAX(o."createdAt"),
        MIN(o."createdAt"),
        CASE WHEN COUNT(o.id) > 0 THEN SUM(o.total) / COUNT(o.id) ELSE 0 END,
        CURRENT_TIMESTAMP
      FROM users u
      LEFT JOIN orders o ON u.id = o."userId" AND o.status != 'CANCELLED'
      GROUP BY u.id
      ON CONFLICT("userId") DO UPDATE SET
        "totalOrders" = EXCLUDED."totalOrders",
        "totalSpent" = EXCLUDED."totalSpent",
        "lastOrderDate" = EXCLUDED."lastOrderDate",
        "firstOrderDate" = EXCLUDED."firstOrderDate",
        "averageOrderValue" = EXCLUDED."averageOrderValue",
        "updatedAt" = EXCLUDED."updatedAt"
    `;
  }

  // Export data to Excel
  async exportToExcel(
    type: 'popular-products' | 'customers' | 'inventory' | 'daily-summary' | 'dashboard',
    startDate?: Date,
    endDate?: Date
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Smoethievibes Analytics';
    workbook.created = new Date();

    let worksheet: ExcelJS.Worksheet;
    let data: any[] = [];

    switch (type) {
      case 'popular-products':
        worksheet = workbook.addWorksheet('Produk Populer');
        data = await this.getPopularProducts(100);
        this.populatePopularProductsWorksheet(worksheet, data);
        break;

      case 'customers':
        worksheet = workbook.addWorksheet('Analitik Pelanggan');
        data = await this.getCustomerAnalytics(100);
        this.populateCustomerAnalyticsWorksheet(worksheet, data);
        break;

      case 'inventory':
        worksheet = workbook.addWorksheet('Peringatan Inventaris');
        data = await this.getInventoryAlerts();
        this.populateInventoryWorksheet(worksheet, data);
        break;

      case 'daily-summary':
        worksheet = workbook.addWorksheet('Ringkasan Harian');
        data = await this.getDailySummary(startDate, endDate);
        this.populateDailySummaryWorksheet(worksheet, data);
        break;

      case 'dashboard':
        worksheet = workbook.addWorksheet('Statistik Dashboard');
        const stats = await this.getDashboardStats();
        this.populateDashboardWorksheet(worksheet, stats);
        break;

      default:
        throw new Error(`Tipe export tidak valid: ${type}`);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private populatePopularProductsWorksheet(worksheet: ExcelJS.Worksheet, data: any[]) {
    worksheet.columns = [
      { header: 'ID Produk', key: 'id', width: 10 },
      { header: 'Nama Produk', key: 'name', width: 30 },
      { header: 'Harga', key: 'price', width: 15 },
      { header: 'Stok', key: 'stock', width: 10 },
      { header: 'Total Terjual', key: 'totalSold', width: 15 },
      { header: 'Total Pendapatan', key: 'totalRevenue', width: 20 },
      { header: 'Kategori', key: 'categoryName', width: 20 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    data.forEach(item => {
      worksheet.addRow({
        id: item.id,
        name: item.name,
        price: item.price,
        stock: item.stock,
        totalSold: item.totalSold,
        totalRevenue: item.totalRevenue,
        categoryName: item.categoryName
      });
    });

    // Format currency
    worksheet.getColumn('price').numFmt = '"Rp"#,##0';
    worksheet.getColumn('totalRevenue').numFmt = '"Rp"#,##0';
  }

  private populateCustomerAnalyticsWorksheet(worksheet: ExcelJS.Worksheet, data: any[]) {
    worksheet.columns = [
      { header: 'ID Pelanggan', key: 'id', width: 10 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Nama', key: 'name', width: 25 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Total Pesanan', key: 'totalOrders', width: 15 },
      { header: 'Total Pengeluaran', key: 'totalSpent', width: 20 },
      { header: 'Rata-rata Nilai Pesanan', key: 'avgOrderValue', width: 20 },
      { header: 'Tanggal Pesanan Terakhir', key: 'lastOrderDate', width: 20 },
      { header: 'Status Pelanggan', key: 'customerStatus', width: 15 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    data.forEach(item => {
      worksheet.addRow({
        id: item.id,
        email: item.email,
        name: item.name,
        role: item.role,
        totalOrders: item.totalOrders,
        totalSpent: item.totalSpent,
        avgOrderValue: item.avgOrderValue,
        lastOrderDate: item.lastOrderDate,
        customerStatus: item.customerStatus
      });
    });

    // Format currency
    worksheet.getColumn('totalSpent').numFmt = '"Rp"#,##0';
    worksheet.getColumn('avgOrderValue').numFmt = '"Rp"#,##0';
    worksheet.getColumn('lastOrderDate').numFmt = 'dd/mm/yyyy';
  }

  private populateInventoryWorksheet(worksheet: ExcelJS.Worksheet, data: any[]) {
    worksheet.columns = [
      { header: 'ID Produk', key: 'id', width: 10 },
      { header: 'Nama Produk', key: 'name', width: 30 },
      { header: 'Stok', key: 'stock', width: 10 },
      { header: 'Kategori', key: 'categoryName', width: 20 },
      { header: 'Status Stok', key: 'stockStatus', width: 15 },
      { header: 'Terjual 30 Hari Terakhir', key: 'totalSoldLast30Days', width: 20 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    data.forEach(item => {
      const row = worksheet.addRow({
        id: item.id,
        name: item.name,
        stock: item.stock,
        categoryName: item.categoryName,
        stockStatus: item.stockStatus,
        totalSoldLast30Days: item.totalSoldLast30Days
      });

      // Color coding based on stock status
      if (item.stockStatus === 'OUT_OF_STOCK') {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF0000' } };
      } else if (item.stockStatus === 'LOW_STOCK') {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
      }
    });
  }

  private populateDailySummaryWorksheet(worksheet: ExcelJS.Worksheet, data: any[]) {
    worksheet.columns = [
      { header: 'Tanggal', key: 'date', width: 15 },
      { header: 'Total Pesanan', key: 'totalOrders', width: 15 },
      { header: 'Total Pendapatan', key: 'totalRevenue', width: 20 },
      { header: 'Rata-rata Nilai Pesanan', key: 'avgOrderValue', width: 20 },
      { header: 'Produk Terjual', key: 'productsSold', width: 15 },
      { header: 'Pelanggan Unik', key: 'uniqueCustomers', width: 15 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    data.forEach(item => {
      worksheet.addRow({
        date: item.date,
        totalOrders: item.totalOrders,
        totalRevenue: item.totalRevenue,
        avgOrderValue: item.avgOrderValue,
        productsSold: item.productsSold,
        uniqueCustomers: item.uniqueCustomers
      });
    });

    // Format currency and date
    worksheet.getColumn('date').numFmt = 'dd/mm/yyyy';
    worksheet.getColumn('totalRevenue').numFmt = '"Rp"#,##0';
    worksheet.getColumn('avgOrderValue').numFmt = '"Rp"#,##0';
  }

  private populateDashboardWorksheet(worksheet: ExcelJS.Worksheet, stats: any) {
    worksheet.columns = [
      { header: 'Metrik', key: 'metric', width: 25 },
      { header: 'Nilai', key: 'value', width: 20 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    const data = [
      { metric: 'Total Pengguna', value: stats.totalUsers },
      { metric: 'Total Pesanan', value: stats.totalOrders },
      { metric: 'Total Pendapatan', value: stats.totalRevenue },
      { metric: 'Pesanan Hari Ini', value: stats.todayOrders },
      { metric: 'Pesanan Tertunda', value: stats.pendingOrders },
      { metric: 'Produk Stok Rendah', value: stats.lowStockProducts },
    ];

    data.forEach(item => {
      const row = worksheet.addRow(item);
      if (item.metric === 'Total Pendapatan') {
        row.getCell('value').numFmt = '"Rp"#,##0';
      }
    });
  }
}