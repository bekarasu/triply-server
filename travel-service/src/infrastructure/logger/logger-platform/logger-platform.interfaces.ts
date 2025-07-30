export interface LoggerPlatform {
  log(message: string | Error): void;
  error(message: string | Error): void;
  warn(message: string | Error): void;
  debug(message: string | Error): void;
  verbose(message: string | Error): void;
}
