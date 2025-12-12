import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('popular-products')
  @ApiOperation({ summary: 'Get popular products with sales data' })
  @ApiResponse({
    status: 200,
    description: 'Popular products retrieved successfully',
  })
  async getPopularProducts(@Query('limit') limit?: number) {
    return this.analyticsService.getPopularProducts(limit || 10);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get customer analytics' })
  @ApiResponse({
    status: 200,
    description: 'Customer analytics retrieved successfully',
  })
  async getCustomerAnalytics(@Query('limit') limit?: number) {
    return this.analyticsService.getCustomerAnalytics(limit || 10);
  }

  @Get('inventory-alerts')
  @ApiOperation({ summary: 'Get inventory alerts for low stock products' })
  @ApiResponse({
    status: 200,
    description: 'Inventory alerts retrieved successfully',
  })
  async getInventoryAlerts() {
    return this.analyticsService.getInventoryAlerts();
  }

  @Get('daily-summary')
  @ApiOperation({ summary: 'Get daily order summary' })
  @ApiResponse({
    status: 200,
    description: 'Daily summary retrieved successfully',
  })
  async getDailySummary(
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.analyticsService.getDailySummary(startDate, endDate);
  }

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
  })
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Post('update-analytics')
  @ApiOperation({ summary: 'Update analytics data manually' })
  @ApiResponse({
    status: 200,
    description: 'Analytics data updated successfully',
  })
  async updateAnalytics() {
    await Promise.all([
      this.analyticsService.updateProductAnalytics(),
      this.analyticsService.updateUserAnalytics(),
    ]);
    return { message: 'Analytics data updated successfully' };
  }

  @Get('export-excel')
  @ApiOperation({ summary: 'Export analytics data to Excel' })
  @ApiResponse({
    status: 200,
    description: 'Excel file generated successfully',
  })
  async exportToExcel(
    @Query('type') type: 'popular-products' | 'customers' | 'inventory' | 'daily-summary' | 'dashboard',
    @Res() res: Response,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    const buffer = await this.analyticsService.exportToExcel(type, startDate, endDate);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=analytics-${type}-${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(buffer);
  }
}