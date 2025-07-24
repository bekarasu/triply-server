import { HttpException } from '@nestjs/common';
import { BaseException, InfrastructureException } from '@libs';

export type ExceptionResponse = {
  requestId: string;
  error: {
    code: string;
    message: string;
    details?: ExceptionDetail[];
  };
};

export type ExceptionDetail = {
  code: string;
  // extend for any kinds of detail
  [key: string]: any;
};

export type ServiceError = Error & { details?: ExceptionDetail[] };

// Base HTTP Exception
export abstract class BaseHttpException<
  E extends BaseException = BaseException,
> extends HttpException {
  public abstract readonly code: string;
  protected readonly exception: E;
  protected requestId: string;

  constructor(appException: E, status?: number) {
    super(appException.message, status);
    this.exception = appException;
  }

  setRequestId(requestId: string) {
    this.requestId = requestId;
    return this;
  }

  /**
   * Get HTTP response on production environment.
   */
  getProductionResponse(): ExceptionResponse {
    const error = this.exception.toJSON();
    delete error.details;
    return {
      requestId: this.requestId,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }

  /**
   * Get HTTP response on development environment.
   */
  getResponse(): ExceptionResponse {
    const error = this.exception.toJSON();
    return {
      requestId: this.requestId,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }
}

export class HttpApiException extends BaseHttpException {
  public code: string;
  protected readonly exception: BaseException;

  constructor(appException: BaseException) {
    super(appException, 400);
    this.code = appException.code;
  }
}

export class HttpInfrastructureException extends BaseHttpException<InfrastructureException> {
  public readonly code: string;

  constructor(infrasException: InfrastructureException) {
    super(infrasException, infrasException.getProtocolCode('http') as number);
    this.code = infrasException.code;
  }
}

export class HttpServiceException extends BaseHttpException<any> {
  public readonly code: string = 'SERVICE_ERROR';

  constructor(error?: Error) {
    super(error, 500);
    this.message = 'Service Error';
  }

  getProductionResponse(): ExceptionResponse {
    return {
      requestId: this.requestId,
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }

  getResponse(): ExceptionResponse {
    return {
      requestId: this.requestId,
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}
