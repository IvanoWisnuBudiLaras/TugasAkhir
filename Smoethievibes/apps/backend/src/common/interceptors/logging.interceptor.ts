import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(ConfigService)
    private configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        
        const logTemplate = this.configService.get('messages.info.requestLog') || '${method} ${url} ${statusCode} - ${delay}ms';
        const logMessage = logTemplate
          .replace('${method}', method)
          .replace('${url}', url)
          .replace('${statusCode}', response.statusCode)
          .replace('${delay}', delay.toString());
          
        console.log(logMessage);
      }),
    );
  }
}