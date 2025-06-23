import { Injectable } from '@nestjs/common';
import * as fastJson from 'fast-json-stringify';
import {
  IAppLogger,
  IRequestLogger,
  LoggerConfig,
  RequestInfo,
} from './logger.interfaces';

type RequestItem = {
  start: number;
  requestInfo: RequestInfo;
};

@Injectable()
export class RequestLogger implements IRequestLogger {
  private readonly REQ_ITEM_KEY = 'requestLogger.requestItem';
  private readonly config: LoggerConfig;
  private stringify: any;

  constructor(
    private readonly logger: IAppLogger,
    private readonly loggerConfig: LoggerConfig,
  ) {
    this.config = loggerConfig;
    this.stringify = fastJson({
      title: 'RequestInfo',
      type: 'object',
      properties: {
        placement: {
          type: 'string',
        },
        path: {
          type: 'string',
        },
        method: {
          type: 'string',
        },
        requestContentLength: {
          type: 'string',
        },
        userAgent: {
          type: 'string',
        },
        statusCode: {
          type: 'number',
        },
        duration: {
          type: 'number',
        },
        router: {
          type: 'string',
        },
      },
    });
  }

  logStart(req): RequestInfo {
    if (!this.isLogAllowed(req.baseUrl)) {
      return;
    }

    const requestInfo = {
      placement: 'begin',
      path: req.baseUrl + (req.path === '/' ? '' : req.path),
      method: req.method,
      requestContentLength: parseInt(req.get('content-length') || '0'),
      userAgent: req.get('user-agent'),
      statusCode: undefined,
      duration: undefined,
      router: undefined,
    } as RequestInfo;
    this.logger.log(this.stringify(requestInfo));
    req[this.REQ_ITEM_KEY] = {
      requestInfo,
      start: Date.now(),
    };
    return requestInfo;
  }

  logEnd(req: any, res: any) {
    if (!this.isLogAllowed(req.path)) {
      return;
    }

    const { start, requestInfo } = req[this.REQ_ITEM_KEY] as RequestItem;

    // update end-log
    requestInfo.placement = 'end';
    requestInfo.duration = Date.now() - start;
    requestInfo.statusCode = res.statusCode;
    requestInfo.router = this.getPathRouter(req);

    // set custom headers
    res.setHeader('x-duration-time', requestInfo.duration);

    this.logger.log(this.stringify(requestInfo));

    return requestInfo;
  }

  private getPathRouter(req: any) {
    let path = req.baseUrl + (req.path === '/' ? '' : req.path);
    const params = req.params;
    Object.keys(params).forEach((paramName) => {
      const val = params[paramName];
      path = path.replace(val, `:${paramName}`);
    });
    return path;
  }

  private isLogAllowed(path: string) {
    if (path.includes('/healthcheck')) {
      return this.config.logHealthcheck;
    }

    return true;
  }
}
