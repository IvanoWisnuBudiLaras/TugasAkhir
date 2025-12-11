import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateProductInput } from './dto/create-product.input';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF)
  async findAll() {
    return this.productService.findAll();
  }

  @Get('categories')
  @UseGuards(JwtAuthGuard) // Hanya butuh JWT, tidak perlu role
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF, UserRole.CUSTOMER) // Izinkan semua role yang terautentikasi
  async findAllCategories() {
    try {
      return await this.productService.findAllCategories();
    } catch (error) {
      console.error('Error in findAllCategories controller:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  @Post('categories')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async createCategory(@Body() categoryData: CreateCategoryInput) {
    try {
      return await this.productService.createCategory(categoryData);
    } catch (error) {
      const err = error as Error;
      if (err.message.includes('already exists')) {
        throw new HttpException({
          status: HttpStatus.CONFLICT,
          error: err.message
        }, HttpStatus.CONFLICT);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to create category'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('categories/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async updateCategory(@Param('id') id: string, @Body() categoryData: UpdateCategoryInput) {
    try {
      return await this.productService.updateCategory(id, categoryData);
    } catch (error) {
      const err = error as Error;
      if (err.message.includes('already exists')) {
        throw new HttpException({
          status: HttpStatus.CONFLICT,
          error: err.message
        }, HttpStatus.CONFLICT);
      }
      if (err.message.includes('not found')) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: err.message
        }, HttpStatus.NOT_FOUND);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to update category'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('categories/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async deleteCategory(@Param('id') id: string) {
    try {
      return await this.productService.deleteCategory(id);
    } catch (error) {
      const err = error as Error;
      if (err.message.includes('Cannot delete category that has products')) {
        throw new HttpException({
          status: HttpStatus.CONFLICT,
          error: err.message
        }, HttpStatus.CONFLICT);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to delete category',
        message: err.message
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