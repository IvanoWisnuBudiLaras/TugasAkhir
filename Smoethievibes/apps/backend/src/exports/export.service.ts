import { Injectable, Inject } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import messagesConfig from '../config/messages.config';

export interface ExportOptions {
  type: 'users' | 'products' | 'orders';
  format: 'excel' | 'csv';
  dateFrom?: Date;
  dateTo?: Date;
  filters?: Record<string, any>;
}

@Injectable()
export class ExportService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  async exportToExcel(options: ExportOptions): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Smoethievibes Admin';
    workbook.lastModifiedBy = 'Admin';
    workbook.created = new Date();
    workbook.modified = new Date();

    switch (options.type) {
      case 'users':
        await this.exportUsers(workbook, options);
        break;
      case 'products':
        await this.exportProducts(workbook, options);
        break;
      case 'orders':
        await this.exportOrders(workbook, options);
        break;
      default:
        throw new Error('Unsupported export type');
    }

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  private async exportUsers(workbook: ExcelJS.Workbook, options: ExportOptions) {
    const worksheet = workbook.addWorksheet('Users');
    
    // Define columns
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Last Login', key: 'lastLogin', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 },
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Fetch data
    const where = this.buildWhereClause(options);
    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Add data
    users.forEach((user: any) => {
      worksheet.addRow({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || '',
        role: user.role,
        status: user.isActive ? 'Active' : 'Inactive',
        lastLogin: user.lastLogin ? this.formatDate(user.lastLogin) : 'Never',
        createdAt: this.formatDate(user.createdAt),
        updatedAt: this.formatDate(user.updatedAt),
      });
    });

    // Auto-filter
    worksheet.autoFilter = {
      from: 'A1',
      to: `J1`
    };
  }

  private async exportProducts(workbook: ExcelJS.Workbook, options: ExportOptions) {
    const worksheet = workbook.addWorksheet('Products');
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Category ID', key: 'categoryId', width: 15 },
      { header: 'Image', key: 'image', width: 30 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 },
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    const where = this.buildWhereClause(options);
    const products = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    products.forEach((product: any) => {
      worksheet.addRow({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        image: product.image || '',
        createdAt: this.formatDate(product.createdAt),
        updatedAt: this.formatDate(product.updatedAt),
      });
    });

    worksheet.autoFilter = {
      from: 'A1',
      to: `K1`
    };
  }

  private async exportOrders(workbook: ExcelJS.Workbook, options: ExportOptions) {
    const worksheet = workbook.addWorksheet('Orders');
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'User Name', key: 'userName', width: 20 },
      { header: 'User Email', key: 'userEmail', width: 25 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Order Type', key: 'orderType', width: 15 },
      { header: 'Queue Number', key: 'queueNumber', width: 15 },
      { header: 'Table Number', key: 'tableNumber', width: 15 },
      { header: 'Notes', key: 'notes', width: 30 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 },
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    const where = this.buildWhereClause(options);
    const orders = await this.prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    orders.forEach((order: any) => {
      worksheet.addRow({
        id: order.id,
        userName: order.user.name,
        userEmail: order.user.email,
        total: order.total,
        status: order.status,
        orderType: order.orderType,
        queueNumber: order.queueNumber || '',
        tableNumber: order.tableNumber || '',
        notes: order.notes || '',
        createdAt: this.formatDate(order.createdAt),
        updatedAt: this.formatDate(order.updatedAt),
      });
    });

    worksheet.autoFilter = {
      from: 'A1',
      to: `I1`
    };
  }

  private buildWhereClause(options: ExportOptions): any {
    const where: any = {};
    
    if (options.dateFrom || options.dateTo) {
      where.createdAt = {};
      if (options.dateFrom) {
        where.createdAt.gte = options.dateFrom;
      }
      if (options.dateTo) {
        where.createdAt.lte = options.dateTo;
      }
    }

    if (options.filters) {
      Object.assign(where, options.filters);
    }

    return where;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  generateFileName(type: string): string {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    return `${type}_${dateStr}_${timeStr}.xlsx`;
  }
}