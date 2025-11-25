import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
  ValidationPipe as NestValidationPipe,
  Inject,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ConfigService } from '@nestjs/config';

interface ValidationConfig {
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  transform?: boolean;
  enableImplicitConversion?: boolean;
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private nestValidationPipe: NestValidationPipe;

  constructor(configService: ConfigService) {
    const validationOptions = configService.get<ValidationConfig>('validation') || {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      enableImplicitConversion: true,
    };
    this.nestValidationPipe = new NestValidationPipe(validationOptions);
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }
    
    // Gunakan config yang sudah ada
    try {
      return await this.nestValidationPipe.transform(value, metadata);
    } catch (error) {
      // Custom error handling tetap bisa ditambahkan di sini
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
      throw new BadRequestException(`Validation failed: ${errorMessage}`);
    }
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}