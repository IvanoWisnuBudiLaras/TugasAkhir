import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(
    @Inject(ConfigService)
    private configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const status =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
          error instanceof HttpException
            ? error.message
            : this.configService.get('messages.errors.internalServerError');

        const errorLogTemplate = this.configService.get('messages.info.errorLog') || 'Error: ${message}';
        console.error(errorLogTemplate.replace('${message}', message), error.stack);

        return throwError(() => new HttpException(
          {
            success: false,
            message,
            timestamp: new Date().toISOString(),
            path: context.switchToHttp().getRequest()?.url,
          },
          status,
        ));
      }),
    );
  }
}