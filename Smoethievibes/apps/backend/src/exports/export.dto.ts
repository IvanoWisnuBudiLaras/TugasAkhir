import { IsEnum, IsOptional, IsDateString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExportDto {
  @ApiProperty({
    description: 'Type of data to export',
    enum: ['users', 'products', 'orders'],
    example: 'users'
  })
  @IsEnum(['users', 'products', 'orders'])
  type!: 'users' | 'products' | 'orders';

  @ApiProperty({
    description: 'Export format',
    enum: ['excel', 'csv'],
    example: 'excel',
    required: false
  })
  @IsOptional()
  @IsEnum(['excel', 'csv'])
  format?: 'excel' | 'csv' = 'excel';

  @ApiProperty({
    description: 'Start date for data filter (YYYY-MM-DD)',
    example: '2024-01-01',
    required: false
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({
    description: 'End date for data filter (YYYY-MM-DD)',
    example: '2024-12-31',
    required: false
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({
    description: 'Additional filters',
    example: { role: 'USER', status: 'ACTIVE' },
    required: false
  })
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}