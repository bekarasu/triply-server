import { TokenExpiredError } from 'jsonwebtoken';

import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import {
  AccessTokenExpiredException,
  InvalidAccessTokenException,
  MissingAccessTokenException,
} from './authentication.errors';
import {
  AuthenticationResult,
  User,
  IAuthenticator,
} from './authentication.interfaces';
import { ConfigService } from '@nestjs/config';
import { CONFIGS } from '../config';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { IAppLogger, LoggerFactory } from '../logger';

const ACCESS_TOKEN_HEADER = 'x-access-token';

export interface UserAPIConfig {
  publicKey?: string;
  requestTimeout?: number;
}

export const USER_API_CONFIG_PROVIDER = 'AUTHENTICATION.API';

@Injectable()
export class UserAPIAuthenticator implements IAuthenticator {
  name = 'api';
  private readonly config: UserAPIConfig;
  private readonly redisClient: Redis;
  private readonly logger: IAppLogger;

  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
    redisService: RedisService,
    loggerFactory: LoggerFactory,
  ) {
    this.config = configService.get(CONFIGS.AUTHENTICATION)[
      USER_API_CONFIG_PROVIDER
    ];
    this.logger = loggerFactory.createAppLogger('UserAPIAuthenticator');
    this.redisClient = redisService.getOrThrow('authentication');
  }

  async handle(context: ExecutionContext): Promise<AuthenticationResult> {
    try {
      const req = context.switchToHttp().getRequest() as any;
      const accessToken = req.headers[ACCESS_TOKEN_HEADER] as string;

      if (!accessToken) {
        throw new MissingAccessTokenException();
      }

      const payload = await this.verifyAccessToken(accessToken);
      if (!payload) {
        throw new InvalidAccessTokenException();
      }

      const user = this.verifyPayloadUser(payload);
      if (!user) {
        throw new InvalidAccessTokenException();
      }
      await this.verifyAccessTokenInUse(user.sub, accessToken);
      req.auth = {
        user,
      };
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AccessTokenExpiredException();
      }
      this.logger.error(error);
      throw new InvalidAccessTokenException();
    }
  }

  async verifyAccessTokenInUse(userId: string, token: string) {
    const { requestTimeout } = this.config;
    try {
      const currentAccessToken = await new Promise(async (resolve) => {
        const timer = setTimeout(() => {
          resolve(-1);
        }, requestTimeout);
        const accessToken = await this.redisClient.get(userId);
        clearTimeout(timer);
        resolve(accessToken);
      });
      if (currentAccessToken === -1) {
        this.logger.debug(`Redis timeout after ${requestTimeout}`);
        return;
      }
      if (!currentAccessToken) {
        this.logger.debug('Current access token not found');
        return;
      }
      if (currentAccessToken !== token) {
        throw new InvalidAccessTokenException();
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async verifyAccessToken(token: string) {
    return this.verifyAccessTokenByPrivateKey(token);
  }

  private async verifyAccessTokenByPrivateKey(token: string) {
    /**
     * PAYLOAD FORMAT:
     * {
     *    sub: string, // ID of user
     *    club: string, // Club ID
     *    profile: string, // profile ID
     *    provider: {
     *       sub: string, // Id of user in provider. eg: facebook, google, etc
     *       type: string // type of provider. eg: facebook, google, etc
     *    }
     * }
     */
    const verifyOptions = {
      publicKey: this.config.publicKey,
      algorithms: ['RS256'],
    } as JwtVerifyOptions;
    const payload = await this.jwtService.verifyAsync(token, verifyOptions);
    return payload;
  }

  private verifyPayloadUser(payload: any) {
    if (!payload || !payload.sub) {
      return null;
    }
    return {
      sub: payload.sub,
      provider: {
        id: payload.provider?.sub,
      },
    } as User;
  }
}
