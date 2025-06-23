import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { RQEUEST_LOGGER } from './logger.consts';
import { RequestLogger } from './request.logger';
@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(RQEUEST_LOGGER) private readonly requestLogger: RequestLogger,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      tap({
        next: () => this.requestLogger.logEnd(req, res),
      }),
    );
  }
}
