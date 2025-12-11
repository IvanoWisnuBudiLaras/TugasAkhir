import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
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

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async findAll() {
    return this.orderService.findAll();
  }

  @Get('my-orders')
  async getMyOrders(@CurrentUser() user: any) {
    return this.orderService.findByUser(user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.orderService.findByUser(userId);
  }

  @Post()
  async create(@Body() orderData: any, @CurrentUser() user: any) {
    return this.orderService.create({ ...orderData, userId: user.sub });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() orderData: any) {
    return this.orderService.update(id, orderData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}