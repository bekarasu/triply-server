import { TokenExpiredError } from 'jsonwebtoken';

import {
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  OnModuleDestroy,
} from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import {
  AccessTokenExpiredException,
  InvalidAccessTokenException,
  MissingAccessTokenException,
} from './authentication.errors';
import {
  AuthenticationResult,
  GameUser,
  IAuthenticator,
} from './authentication.interfaces';
import { ConfigService } from '@nestjs/config';
import { CONFIGS } from '../config';
import { APP_LOGGER } from '@infras/logger';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

const ACCESS_TOKEN_HEADER = 'x-access-token';

export interface GameAPIConfig {
  publicKey?: string;
  secretKey?: string;
}

export const USER_API_CONFIG_PROVIDER = 'AUTHENTICATION.USER_API';

@Injectable()
export class UserAPIAuthenticator implements IAuthenticator, OnModuleDestroy {
  name = 'game-api';
  private readonly config: GameAPIConfig;
  private readonly redisClient: Redis;

  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
    redisService: RedisService,
    @Inject(APP_LOGGER)
    private readonly logger: LoggerService,
  ) {
    this.config = configService.get(CONFIGS.AUTHENTICATION)[
      USER_API_CONFIG_PROVIDER
    ];
    this.redisClient = redisService.getOrThrow(CONFIGS.AUTHENTICATION);
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
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

      // Comment for game dev
      // await this.verifyAccessTokenInUse(user.userId, accessToken)

      req.auth = {
        user,
      };
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AccessTokenExpiredException();
      }
      this.logger.error(error, '[game-api-authentication]');
      throw new InvalidAccessTokenException();
    }
  }

  async verifyAccessTokenInUse(userId: string, token: string) {
    const currentAccessToken = await this.redisClient.get(userId);
    if (currentAccessToken !== token) throw new InvalidAccessTokenException();
  }

  async verifyAccessToken(token: string) {
    return Promise.allSettled([
      this.verifyAccessTokenByPrivateKey(token),
      this.verifyTokenWithSecret(token),
    ])
      .then((result) => {
        if (result[0].status === 'fulfilled') {
          return result[0].value;
        }
        if (result[1].status === 'fulfilled') {
          return result[1].value;
        }
        // prioritize private key verification error
        throw result[0].reason;
      })
      .catch((err) => {
        throw err;
      });
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
      algorithm: ['RS256'],
    } as JwtVerifyOptions;
    const payload = await this.jwtService.verifyAsync(token, verifyOptions);
    return payload;
  }

  private async verifyTokenWithSecret(token: string) {
    const payload = (await this.jwtService.verifyAsync(token, {
      secret: this.config.secretKey,
    })) as GameUser;
    return payload;
  }

  private verifyPayloadUser(payload: any) {
    if (!payload || !payload.sub || !payload.profile) {
      return null;
    }
    return {
      profileId: payload.profile,
      userId: payload.sub,
      provider: {
        id: payload.provider?.sub,
        type: payload.provider?.type,
      },
    } as GameUser;
  }
}
