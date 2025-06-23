import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { RQEUEST_LOGGER } from '../logger.consts';
import { RequestLogger } from '../request.logger';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(@Inject(RQEUEST_LOGGER) private readonly logger: RequestLogger) {}

  use(req: any, res: any, next: (error?: any) => void) {
    this.logger.logStart(req);
    next();
  }
}
