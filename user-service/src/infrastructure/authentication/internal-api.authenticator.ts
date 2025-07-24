import { IAppLogger, LoggerFactory } from '@infras/logger';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONFIGS } from '../config';
import {
  InvalidServerKeyException,
  MissingServerKeyException,
} from './authentication.errors';
import {
  AuthenticationResult,
  IAuthenticator,
} from './authentication.interfaces';

const SERVER_KEY_HEADER = 'x-server-key';

export interface InternalAPIConfig {
  hashServerKey: string;
  publicServerKey: string;
}

export const INTERNAL_API_CONFIG_PROVIDER = 'AUTHENTICATION.INTERNAL_API';

@Injectable()
export class InternalAPIAuthenticator implements IAuthenticator {
  name = 'internal';
  private readonly config: InternalAPIConfig;
  private readonly logger: IAppLogger;

  constructor(loggerFactory: LoggerFactory, configService: ConfigService) {
    this.config = configService.get(CONFIGS.AUTHENTICATION)[
      INTERNAL_API_CONFIG_PROVIDER
    ];
    this.logger = loggerFactory.createAppLogger('InternalAPIAuthenticator');
  }

  async handle(context: ExecutionContext): Promise<AuthenticationResult> {
    try {
      const req = context.switchToHttp().getRequest() as any;
      const serverKey = req.headers[SERVER_KEY_HEADER];
      if (!serverKey) {
        throw new MissingServerKeyException();
      }
      if (this.config.publicServerKey !== serverKey) {
        throw new InvalidServerKeyException();
      }
      return true;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
