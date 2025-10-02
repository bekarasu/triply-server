import { ModuleMetadata, Type } from '@nestjs/common';
import { GoogleSMTPConfig } from './google-smtp/google-smtp.config';

export interface SMTPModuleOptions {
  googleSMTP?: GoogleSMTPConfig;
}

export interface SMTPModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<SMTPModuleOptionsFactory>;
  useClass?: Type<SMTPModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<SMTPModuleOptions> | SMTPModuleOptions;
  inject?: any[];
}

export interface SMTPModuleOptionsFactory {
  createSMTPOptions(): Promise<SMTPModuleOptions> | SMTPModuleOptions;
}
