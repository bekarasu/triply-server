import {
  DynamicModule,
  Module,
  NestModule,
  MiddlewareConsumer,
  Inject,
} from '@nestjs/common';
import {
  ForRootAsyncOptions,
  LoggerPlatformProvider,
} from './logger.providers';
import { ForRootOptions, LoggerConfig } from './logger.interfaces';
import { APP_LOGGER, LOGGER_CONFIG, RQEUEST_LOGGER } from './logger.consts';
import { LoggerFactory } from './logger.factory';
import { RequestLoggingMiddleware } from './middlewares';

const LOG_LEVEL_ALL = ['log', 'error', 'warn', 'debug', 'verbose'];

@Module({
  providers: [LoggerFactory],
  exports: [LoggerFactory],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }

  static forRoot(options: ForRootOptions): DynamicModule {
    const { type, levels = LOG_LEVEL_ALL } = options;
    const loggerPlatformProvider = LoggerPlatformProvider(type);
    switch (type) {
      case 'console':
        break;
    }
    return {
      module: LoggerModule,
      global: true,
      providers: [
        loggerPlatformProvider,
        this.getDefaultAppLoggerProvider(),
        this.getDefaultRequestLoggerProvider(),
        {
          provide: LOGGER_CONFIG,
          useValue: {
            type,
            levels,
          },
        },
      ],
      exports: [APP_LOGGER, RQEUEST_LOGGER],
    };
  }

  static forRootAsync(options: ForRootAsyncOptions): DynamicModule {
    const { type, configProvider } = options;
    const loggerPlatformProvider = LoggerPlatformProvider(type);
    return {
      module: LoggerModule,
      global: true,
      providers: [
        loggerPlatformProvider,
        this.getDefaultAppLoggerProvider(),
        this.getDefaultRequestLoggerProvider(),
        {
          provide: LOGGER_CONFIG,
          ...configProvider,
        },
      ],
      exports: [APP_LOGGER, RQEUEST_LOGGER],
    };
  }

  private static getDefaultAppLoggerProvider() {
    return {
      provide: APP_LOGGER,
      useFactory: (loggerFactory: LoggerFactory, loggerConfig: LoggerConfig) =>
        loggerFactory.createAppLogger(loggerConfig.defaultContext),
      inject: [LoggerFactory, LOGGER_CONFIG],
    };
  }

  private static getDefaultRequestLoggerProvider() {
    return {
      provide: RQEUEST_LOGGER,
      useFactory: (loggerFactory: LoggerFactory) =>
        loggerFactory.createRequestLogger(),
      inject: [LoggerFactory],
    };
  }
}
