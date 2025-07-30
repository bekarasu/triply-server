import { LogLevel } from '@nestjs/common';

export type ErrorMessage = Pick<Error, 'message' | 'stack'>;
export type MessageLog = ErrorMessage | string;

export interface IAppLogger {
  log(message: MessageLog): void;
  warn(message: MessageLog): void;
  error(message: MessageLog): void;
  debug(message: MessageLog): void;
  verbose(message: MessageLog): void;
}
export interface LoggerConfig {
  levels?: LogLevel[];
  defaultContext?: string;
  appId?: string;
  printTrace?: boolean;
  platformConfig: any;
  logHealthcheck?: boolean;
}

export interface ForRootOptions extends LoggerConfig {
  type: 'console';
}

export interface RequestInfo {
  placement: 'begin' | 'end';
  path: string;
  method: string;
  requestContentLength: number;
  userAgent: string;
  statusCode: number;
  duration?: number;
  router: string;
}

export interface IRequestLogger {
  logStart(req: any): void;
  logEnd(req: any, res: any): void;
}
