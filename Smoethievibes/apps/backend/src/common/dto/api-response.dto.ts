import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class ApiResponseDto<T = any> {
  @IsBoolean()
  success!: boolean;

  @IsString()
  @IsOptional()
  message?: string;

  @IsOptional()
  data?: T;

  @IsString()
  timestamp!: string;

  @IsString()
  @IsOptional()
  path?: string;
}

export class ErrorResponseDto {
  @IsBoolean()
  success!: false;

  @IsString()
  message!: string;

  @IsString()
  @IsOptional()
  error?: string;

  @IsString()
  timestamp!: string;

  @IsString()
  @IsOptional()
  path?: string;
}