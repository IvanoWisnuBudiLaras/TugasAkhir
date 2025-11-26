import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class CustomException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        success: false,
        message,
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}

export class NotFoundException extends CustomException {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedException extends CustomException {
  constructor(message?: string) {
    super(message || 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends CustomException {
  constructor(message?: string) {
    super(message || 'Forbidden', HttpStatus.FORBIDDEN);
  }
}

export class ConflictException extends CustomException {
  constructor(message?: string) {
    super(message || 'Conflict', HttpStatus.CONFLICT);
  }
}