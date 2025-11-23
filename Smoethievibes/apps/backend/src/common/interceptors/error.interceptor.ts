import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
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
            : 'Internal server error';

        console.error(`Error: ${message}`, error.stack);

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