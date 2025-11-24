import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isUUID } from 'class-validator';

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string> {
  constructor(
    @Inject(ConfigService)
    private configService?: ConfigService,
  ) {}

  transform(value: string, metadata: ArgumentMetadata): string {
    if (!isUUID(value)) {
      const defaultMessage = 'Validation failed (uuid is expected)';
      const message = this.configService?.get('messages.errors.validationFailed') || defaultMessage;
      throw new BadRequestException(
        message.replace('${field}', metadata.data || 'field'),
      );
    }
    return value;
  }
}