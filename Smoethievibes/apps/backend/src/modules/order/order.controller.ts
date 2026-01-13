import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  // Admin & Manager bisa melihat semua order
  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async findAll() {
    return this.orderService.findAll();
  }

  // User melihat order miliknya sendiri
  @Get('my-orders')
  async getMyOrders(@CurrentUser() user: any) {
    // Pastikan menggunakan user.id atau user.sub sesuai payload JWT Anda
    const userId = user.id || user.sub;
    return this.orderService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  // User membuat order (userId otomatis diambil dari Token)
  @Post()
  async create(@Body() orderData: any, @CurrentUser() user: any) {
    const userId = user.id || user.sub;
    return this.orderService.create({ ...orderData, userId });
  }

  /**
   * SINKRONISASI UNTUK ADMIN:
   * Menambahkan PATCH untuk update status secara spesifik.
   * Ini yang dipanggil oleh dropdown di halaman admin/orders.
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async updateStatus(
    @Param('id') id: string, 
    @Body('status') status: string
  ) {
    return this.orderService.updateStatus(id, status);
  }

  // Update data order secara keseluruhan (jika diperlukan)
  @Put(':id')
  async update(@Param('id') id: string, @Body() orderData: any) {
    return this.orderService.update(id, orderData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async findByUser(@Param('userId') userId: string) {
    return this.orderService.findByUser(userId);
  }
}