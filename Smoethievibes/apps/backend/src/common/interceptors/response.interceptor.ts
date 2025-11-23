import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    
    return next.handle().pipe(
      map((data) => {
        const response = new ApiResponseDto();
        response.success = true;
        response.message = 'Request successful';
        response.data = data;
        response.timestamp = new Date().toISOString();
        response.path = request.url;
        
        return response;
      }),
    );
  }
}