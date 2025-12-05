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

// Input sanitization helper
const sanitizeInput = (value: any): any => {
  if (typeof value === 'string') {
    // Remove potentially dangerous characters
    return value
      .trim()
      .replace(/[<>\"'&]/g, '') // Remove HTML entities and quotes
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeInput);
  }
  if (typeof value === 'object' && value !== null) {
    const sanitized: any = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        // Sanitize key names too
        const sanitizedKey = key.replace(/[<>\"'&]/g, '');
        sanitized[sanitizedKey] = sanitizeInput(value[key]);
      }
    }
    return sanitized;
  }
  return value;
};

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
    
    // Sanitize input first
    const sanitizedValue = sanitizeInput(value);
    
    try {
      return await this.nestValidationPipe.transform(sanitizedValue, metadata);
    } catch (error) {
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