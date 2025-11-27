import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get()
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