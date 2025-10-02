import { DynamicModule, Module, Provider } from '@nestjs/common';
import { GOOGLE_SMTP_CONFIG_PROVIDER } from './google-smtp/google-smtp.config';
import { GoogleSMTPService } from './google-smtp/google-smtp.service';
import { EMAIL_SERVICE_PROVIDER } from './interfaces/email-service.interface';
import {
  GOOGLE_SMTP_SERVICE_TOKEN,
  SMTP_MODULE_OPTIONS_TOKEN,
} from './smtp.constants';
import {
  SMTPModuleAsyncOptions,
  SMTPModuleOptions,
  SMTPModuleOptionsFactory,
} from './smtp.interfaces';

@Module({})
export class SMTPModule {
  static forRoot(options: SMTPModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: SMTP_MODULE_OPTIONS_TOKEN,
        useValue: options,
      },
      ...this.createSMTPProviders(),
    ];

    return {
      module: SMTPModule,
      global: true,
      providers,
      exports: [EMAIL_SERVICE_PROVIDER, GOOGLE_SMTP_SERVICE_TOKEN],
    };
  }

  static forRootAsync(options: SMTPModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      ...this.createAsyncProviders(options),
      ...this.createSMTPProviders(),
    ];

    return {
      module: SMTPModule,
      global: true,
      imports: options.imports || [],
      providers,
      exports: [EMAIL_SERVICE_PROVIDER, GOOGLE_SMTP_SERVICE_TOKEN],
    };
  }

  private static createSMTPProviders(): Provider[] {
    return [
      // Google SMTP Configuration Provider
      {
        provide: GOOGLE_SMTP_CONFIG_PROVIDER,
        useFactory: (options: SMTPModuleOptions) => options.googleSMTP,
        inject: [SMTP_MODULE_OPTIONS_TOKEN],
      },
      // Google SMTP Service Provider
      {
        provide: GOOGLE_SMTP_SERVICE_TOKEN,
        useClass: GoogleSMTPService,
      },
      // Default Email Service Provider (aliases to Google SMTP for now)
      {
        provide: EMAIL_SERVICE_PROVIDER,
        useExisting: GOOGLE_SMTP_SERVICE_TOKEN,
      },
    ];
  }

  private static createAsyncProviders(
    options: SMTPModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: SMTPModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: SMTP_MODULE_OPTIONS_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: SMTP_MODULE_OPTIONS_TOKEN,
      useFactory: async (optionsFactory: SMTPModuleOptionsFactory) =>
        optionsFactory.createSMTPOptions(),
      inject: [options.useExisting || options.useClass!],
    };
  }
}
