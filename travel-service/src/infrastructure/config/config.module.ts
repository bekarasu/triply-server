import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// configuration
import authenticationConfig from './authentication.config';
import { validateConfig } from './config.utils';
import databaseConfig from './database.config';
import debugConfig from './debug.config';
import loggerConfig from './logger.config';
import redisConfig from './redis.config';
import requestTimeoutConfig from './request-timeout.config';

export interface ConfigOptions {
  envFilePath: string;
}

@Module({})
export class InfrasConfigModule {
  static forRoot(options: ConfigOptions): DynamicModule {
    const { envFilePath } = options;
    return {
      module: InfrasConfigModule,
      global: true,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate: validateConfig,
          load: [
            databaseConfig,
            loggerConfig,
            debugConfig,
            requestTimeoutConfig,
            redisConfig,
            authenticationConfig,
          ],
          envFilePath,
        }),
      ],
      exports: [ConfigModule],
    };
  }
}
