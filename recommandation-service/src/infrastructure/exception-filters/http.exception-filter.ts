import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { BaseException, InfrastructureException } from '@src/libs';
import { APP_LOGGER, IRequestLogger, RQEUEST_LOGGER } from '@infras/logger';
import { EXCEPTION_FILTER_CONFIG_PROVIDER } from './exception-filter.consts';
import { ExceptionFilterConfig } from './exception-filter.interfaces';
import {
  BaseHttpException,
  HttpApiException,
  HttpInfrastructureException,
  HttpServiceException,
} from './http.exceptions';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(EXCEPTION_FILTER_CONFIG_PROVIDER)
    private readonly config: ExceptionFilterConfig,
    @Inject(RQEUEST_LOGGER)
    private readonly requestLogger: IRequestLogger,
    @Inject(APP_LOGGER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const requestId = req.headers[this.config.requestIdHeader];
    let httpException: BaseHttpException;
    // handle exceptions of infrastructure
    if (exception instanceof InfrastructureException) {
      httpException = new HttpInfrastructureException(exception);
    } else if (exception instanceof BaseException) {
      // handle exception of application
      httpException = new HttpApiException(exception);
    } else {
      // unhandled exception
      httpException = new HttpServiceException(exception);
      // log unhandled error
      this.logger.error(exception);
    }
    httpException.setRequestId(requestId);

    const status = httpException.getStatus();
    const response = this.config.isProduction
      ? httpException.getProductionResponse()
      : httpException.getResponse();

    // set status for request log
    res.status(status);

    // log response
    try {
      this.requestLogger.logEnd(req, res);
    } catch (error) {
      this.logger.error('Cannot log request end: ' + error.message);
    }

    // response
    res.json(response);
  }
}
