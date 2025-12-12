import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateProductInput } from './dto/create-product.input';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }



  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    try {
      return await this.productService.findByCategory(categoryId);
    } catch (error) {
      console.error('Error in findByCategory controller:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to fetch products by category',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async create(@Body() productData: CreateProductInput) {
    return this.productService.create(productData);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async update(@Param('id') id: string, @Body() productData: any) {
    return this.productService.update(id, productData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}