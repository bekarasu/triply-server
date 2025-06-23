import { LogLevel } from '@nestjs/common';
import { LoggerPlatform } from './logger-platform';
import { IAppLogger, LoggerConfig, MessageLog } from './logger.interfaces';

export class AppLogger implements IAppLogger {
  protected context: string;
  protected config: LoggerConfig;

  constructor(
    context: string,
    private readonly logger: LoggerPlatform,
  ) {
    this.context = context;
  }

  configure(config: LoggerConfig) {
    this.config = config;
    return this;
  }

  warn(message: MessageLog): void {
    const logMessage = this.getFormattedLogMessage('warn', message);
    this.logger.warn(JSON.stringify(logMessage) as any);
  }
  debug(message: MessageLog): void {
    const logMessage = this.getFormattedLogMessage('debug', message);
    this.logger.debug(JSON.stringify(logMessage) as any);
  }
  verbose(message: MessageLog): void {
    const logMessage = this.getFormattedLogMessage('verbose', message);
    this.logger.verbose(JSON.stringify(logMessage) as any);
  }

  error(message: MessageLog): void {
    const logMessage = this.getFormattedLogMessage('error', message);
    this.logger.error(JSON.stringify(logMessage) as any);
  }

  log(message: MessageLog) {
    const logMessage = this.getFormattedLogMessage('log', message);
    this.logger.log(JSON.stringify(logMessage) as any);
  }

  protected getFormattedLogMessage(level: LogLevel, message: MessageLog) {
    let msg, stackTrace;

    if (typeof message !== 'string') {
      msg = message.message;
      stackTrace = message.stack;
    } else {
      msg = message;
    }
    const logMessage = {
      '@timestamp': new Date(),
      message: msg,
      logger_name: this.context,
      stacktrace: stackTrace,
      level: level,
    };

    return logMessage;
  }
}
