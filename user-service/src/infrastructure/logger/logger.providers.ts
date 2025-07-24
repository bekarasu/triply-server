import { DynamicModule } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common';
import { ConsoleLoggerPlatform } from './logger-platform';

export const LOGGER_PLATFORM = 'LOGGER.LOGGER_PLATFORM';

export const LoggerPlatformProvider = (platform: string) => ({
  provide: LOGGER_PLATFORM,
  useFactory: () => {
    switch (platform) {
      case 'console':
        return new ConsoleLoggerPlatform();
    }
    throw new Error('Invalid platform: ' + platform);
  },
});

export interface LoggerConfigFactoryProvider
  extends Omit<FactoryProvider, 'provide'>,
    Pick<DynamicModule, 'imports'> {}

export interface ForRootAsyncOptions {
  type: 'console';
  configProvider: LoggerConfigFactoryProvider;
}
