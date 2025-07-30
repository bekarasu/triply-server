import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from './app.logger';
import { LoggerPlatform } from './logger-platform/logger-platform.interfaces';
import { LOGGER_CONFIG } from './logger.consts';
import { IAppLogger, IRequestLogger, LoggerConfig } from './logger.interfaces';
import { LOGGER_PLATFORM } from './logger.providers';
import { RequestLogger } from './request.logger';

@Injectable()
export class LoggerFactory {
  constructor(
    @Inject(LOGGER_PLATFORM)
    private readonly loggerPlatform: LoggerPlatform,
    @Inject(LOGGER_CONFIG)
    private readonly config: LoggerConfig,
  ) {}

  createAppLogger(context: string): IAppLogger {
    return new AppLogger(context, this.loggerPlatform).configure(this.config);
  }

  createRequestLogger(): IRequestLogger {
    const logger = this.createAppLogger('RequestLogger');
    return new RequestLogger(logger, this.config);
  }
}
