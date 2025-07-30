import { DynamicModule, Module } from '@nestjs/common';
import { EXCEPTION_FILTER_CONFIG_PROVIDER } from './exception-filter.consts';

import { ExceptionFilterConfig } from './exception-filter.interfaces';
@Module({})
export class ExceptionFilterModule {
  static forRoot(options: ExceptionFilterConfig): DynamicModule {
    const { service, isProduction = false } = options;

    return {
      module: ExceptionFilterModule,
      global: true,
      providers: [
        {
          provide: EXCEPTION_FILTER_CONFIG_PROVIDER,
          useValue: {
            service,
            isProduction,
          },
        },
      ],
      exports: [EXCEPTION_FILTER_CONFIG_PROVIDER],
    };
  }
}
