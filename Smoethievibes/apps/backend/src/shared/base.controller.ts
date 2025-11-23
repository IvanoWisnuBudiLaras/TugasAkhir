import { Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';

export abstract class BaseController {
  protected abstract service: any;

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.service.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() createDto: any) {
    return this.service.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}