import { ConsoleLogger, LogLevel } from '@nestjs/common';
import { LoggerPlatform } from './logger-platform.interfaces';

export class ConsoleLoggerPlatform
  extends ConsoleLogger
  implements LoggerPlatform
{
  constructor() {
    super();
  }

  protected formatMessage(
    logLevel: LogLevel,
    message: any,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string,
  ): string {
    return this.stringifyMessage(message + '\n', logLevel);
  }
}
