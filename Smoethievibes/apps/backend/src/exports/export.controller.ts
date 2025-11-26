import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ExportService } from './export.service';
import { ExportDto } from './export.dto';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Export')
@ApiBearerAuth()
@Controller('export')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get()
  @SetMetadata('roles', [UserRole.ADMIN])
  @ApiOperation({ summary: 'Export data to Excel/CSV' })
  @ApiResponse({
    status: 200,
    description: 'File exported successfully',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async export(
    @Query() exportDto: ExportDto,
    @Res() res: Response,
  ) {
    try {
      // Convert date strings to Date objects if provided
      const options = {
        ...exportDto,
        format: exportDto.format || 'excel',
        dateFrom: exportDto.dateFrom ? new Date(exportDto.dateFrom) : undefined,
        dateTo: exportDto.dateTo ? new Date(exportDto.dateTo) : undefined,
      };

      // Generate the file
      const buffer = await this.exportService.exportToExcel(options);
      
      // Set response headers
      const fileName = this.exportService.generateFileName(exportDto.type);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      
      // Send the file
      res.send(buffer);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({
        statusCode: 500,
        message: 'Failed to export data',
        error: errorMessage,
      });
    }
  }

  @Get('users')
  @SetMetadata('roles', [UserRole.ADMIN])
  @ApiOperation({ summary: 'Export users data to Excel' })
  @ApiResponse({ status: 200, description: 'Users exported successfully' })
  async exportUsers(
    @Query() query: ExportDto,
    @Res() res: Response,
  ) {
    return this.export({ ...query, type: 'users' }, res);
  }

  @Get('products')
  @SetMetadata('roles', [UserRole.ADMIN])
  @ApiOperation({ summary: 'Export products data to Excel' })
  @ApiResponse({ status: 200, description: 'Products exported successfully' })
  async exportProducts(
    @Query() query: ExportDto,
    @Res() res: Response,
  ) {
    return this.export({ ...query, type: 'products' }, res);
  }

  @Get('orders')
  @SetMetadata('roles', [UserRole.ADMIN])
  @ApiOperation({ summary: 'Export orders data to Excel' })
  @ApiResponse({ status: 200, description: 'Orders exported successfully' })
  async exportOrders(
    @Query() query: ExportDto,
    @Res() res: Response,
  ) {
    return this.export({ ...query, type: 'orders' }, res);
  }
}