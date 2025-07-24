import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { RequestTimeoutException } from './request-timeout-exception';
import { RequestTimeoutConfig } from './request-timeout.interfaces';
import { REQUEST_TIMEOUT_CONFIG } from './request-timeout.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestTimeoutInterceptor implements NestInterceptor {
  private readonly config: RequestTimeoutConfig;
  constructor(configService: ConfigService) {
    this.config = configService.get(REQUEST_TIMEOUT_CONFIG);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { timeoutInMs } = this.config;
    if (timeoutInMs <= 0) {
      return next.handle();
    }
    return next.handle().pipe(
      timeout(this.config.timeoutInMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
