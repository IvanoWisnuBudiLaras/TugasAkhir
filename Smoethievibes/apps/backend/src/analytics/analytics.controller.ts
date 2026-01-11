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
    try {
      return await this.analyticsService.getPopularProducts(limit || 10);
    } catch (err) {
      console.error('Error fetching popular products:', err);
      return [];
    }
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get customer analytics' })
  @ApiResponse({
    status: 200,
    description: 'Customer analytics retrieved successfully',
  })
  async getCustomerAnalytics(@Query('limit') limit?: number) {
    try {
      return await this.analyticsService.getCustomerAnalytics(limit || 10);
    } catch (err) {
      console.error('Error fetching customer analytics:', err);
      return [];
    }
  }

  @Get('inventory-alerts')
  @ApiOperation({ summary: 'Get inventory alerts for low stock products' })
  @ApiResponse({
    status: 200,
    description: 'Inventory alerts retrieved successfully',
  })
  async getInventoryAlerts() {
    try {
      return await this.analyticsService.getInventoryAlerts();
    } catch (err) {
      console.error('Error fetching inventory alerts:', err);
      return [];
    }
  }

  @Get('daily-summary')
  @ApiOperation({ summary: 'Get daily order summary' })
  @ApiResponse({
    status: 200,
    description: 'Daily summary retrieved successfully',
  })
  async getDailySummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      const s = startDate ? new Date(startDate) : undefined;
      const e = endDate ? new Date(endDate) : undefined;
      return await this.analyticsService.getDailySummary(s, e);
    } catch (err) {
      console.error('Error fetching daily summary:', err);
      return [];
    }
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
    @Query('type') type: string,
    @Res() res: Response,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      const allowed = ['popular-products','customers','inventory','daily-summary','dashboard'];
      const t = allowed.includes(type) ? (type as any) : 'dashboard';
      const s = startDate ? new Date(startDate) : undefined;
      const e = endDate ? new Date(endDate) : undefined;

      const buffer = await this.analyticsService.exportToExcel(t, s, e);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-${t}-${new Date().toISOString().split('T')[0]}.xlsx`);
      return res.send(buffer);
    } catch (err) {
      console.error('Export to Excel failed:', err);
      // Fall back to empty workbook with a single sheet so frontend still receives a file
      try {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Empty');
        sheet.addRow(['No data available or export failed']);
        const buf = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=analytics-empty-${new Date().toISOString().split('T')[0]}.xlsx`);
        return res.send(Buffer.from(buf));
      } catch (e) {
        console.error('Failed to generate fallback workbook:', e);
        return res.status(500).json({ message: 'Export failed' });
      }
    }
  }
}