import { CONFIGS } from '@infras/config';
import { IAppLogger, LoggerFactory } from '@infras/logger';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { v4 as uuidV4 } from 'uuid';
import {
  IUserRefreshSessionRepository,
  UserRefreshSessionOrmEntity,
} from '../../database/user-refresh-token';
import { RefreshSession } from '../../domain/value-objects';
import { InvalidAuthTokenException } from './auth-service.errors';
import { AUTH_TOKEN_SERVICE_CONFIG } from './auth-token-service.providers';
import { AuthTokens } from './auth-token.dto';
import {
  BasePayload,
  IPayloadSerializer,
  IAuthTokenService,
} from './auth-token.interfaces';
import { AccessTokenPayloadSerializer } from '@src/modules/authentication/adapters/token-service';
import {
  IUserRepository,
  UserOrmEntity,
  USER_REPOSITORY,
} from '@src/libs/database';

export interface AuthTokenServiceConfig {
  signTokenPrivateKey: string;
  signTokenPublicKey: string;
  refreshTokenExpiredIn: number;
  accessTokenExpiredIn: number;
}

@Injectable()
export class AuthTokenService implements IAuthTokenService {
  private readonly logger: IAppLogger;
  private readonly config: AuthTokenServiceConfig;
  private readonly redisClient: Redis;

  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
    @Inject('IUserRefreshSessionRepository')
    private readonly repo: IUserRefreshSessionRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    loggerFactory: LoggerFactory,
    redisService: RedisService,
  ) {
    this.logger = loggerFactory.createAppLogger('AuthTokenService');
    this.config = configService.get(AUTH_TOKEN_SERVICE_CONFIG);
    this.redisClient = redisService.getOrThrow(CONFIGS.AUTHENTICATION);
  }

  async generateTokens(
    payloadSerializer: IPayloadSerializer<BasePayload>,
  ): Promise<AuthTokens> {
    try {
      const payload = await payloadSerializer.serialize();

      if (!payload.sub) throw new Error('Invalid payload');
      const existedRefreshToken = await this.repo.getUserRefreshSessionById(
        payload.sub,
      );
      const refreshSession = RefreshSession.generate();

      if (!existedRefreshToken) {
        const newUser = new UserRefreshSessionOrmEntity({
          id: payload.sub,
          refreshSession: refreshSession.refreshSession,
        });

        await this.repo.createRefreshSession(newUser);
      } else {
        existedRefreshToken.refreshSession = refreshSession.refreshSession;
        await this.repo.updateRefreshSession(existedRefreshToken);
      }

      const expiresIn = this.config.refreshTokenExpiredIn;

      const [refreshToken, accessToken] = await Promise.all([
        this.generateRefreshToken(payload, refreshSession),
        this.generateAccessToken(payload),
      ]);

      await this.redisClient.set(payload.sub, accessToken, 'EX', expiresIn);
      return {
        refreshToken,
        accessToken,
        expiresIn,
      } as AuthTokens;
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        throw new InvalidAuthTokenException();
      }
      this.logger.error(error);
      throw error;
    }
  }

  async renewTokens(oldRefreshToken: string): Promise<AuthTokens> {
    try {
      const { signTokenPublicKey } = this.config;
      const verifyOptions = {
        algorithm: 'RS256',
        secret: signTokenPublicKey,
      } as JwtVerifyOptions;

      const oldRefreshTokenPayload = await this.jwtService.verifyAsync(
        oldRefreshToken,
        verifyOptions,
      );
      console.log('Old refresh token payload:', oldRefreshTokenPayload);
      const existedUserRefreshToken = await this.repo.getUserRefreshSessionById(
        oldRefreshTokenPayload.sub,
      );
      if (!existedUserRefreshToken) {
        throw new InvalidAuthTokenException();
      }

      await this.isValidRefreshToken(
        oldRefreshTokenPayload,
        existedUserRefreshToken,
      );
      const refreshSession = RefreshSession.generate();

      const userId = oldRefreshTokenPayload.sub;

      const user: UserOrmEntity = await this.userRepo.getUserById(userId);
      if (!user) {
        throw new InvalidAuthTokenException();
      }

      const sss = new AccessTokenPayloadSerializer(user.toVO());

      const [newRefreshToken, newAccessToken] = await Promise.all([
        this.renewRefreshToken(refreshSession, oldRefreshTokenPayload),
        this.generateAccessToken(sss.serialize()),
      ]);

      existedUserRefreshToken.refreshSession = refreshSession.refreshSession;

      await this.repo.updateRefreshSession(existedUserRefreshToken);
      await this.redisClient.set(
        userId,
        newAccessToken,
        'EX',
        this.config.refreshTokenExpiredIn, // keep access token in redis within the duration of refresh token
      );
      return {
        refreshToken: newRefreshToken,
        accessToken: newAccessToken,
      } as AuthTokens;
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        throw new InvalidAuthTokenException();
      }
      this.logger.error(error);
      throw error;
    }
  }

  async revokeTokens(
    refreshTokenOrId: string,
    flow = 'refreshToken',
  ): Promise<any> {
    try {
      let refreshSessionId;
      if (flow !== 'id' && flow !== 'refreshToken') {
        throw new Error('Invalid revoke token flow: ' + flow);
      }
      if (flow == 'refreshToken') {
        const { signTokenPublicKey } = this.config;
        const verifyOptions = {
          algorithm: 'RS256',
          secret: signTokenPublicKey,
        } as JwtVerifyOptions;

        const refreshTokenPayload = (await this.jwtService.verifyAsync(
          refreshTokenOrId,
          verifyOptions,
        )) as JwtPayload;

        if (!refreshTokenPayload) {
          this.logger.error('Invalid refresh token payload');
          throw new InvalidAuthTokenException();
        }
        refreshSessionId = refreshTokenPayload.sub;
      } else {
        refreshSessionId = refreshTokenOrId;
      }

      const existedUser =
        await this.repo.getUserRefreshSessionById(refreshSessionId);
      if (!existedUser) {
        this.logger.warn('Refresh token session not found');
        return;
      }
      const refreshSession = RefreshSession.init('');
      await this.repo.deleteRefreshSession(existedUser.id);
      await this.redisClient.del(refreshSessionId);
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        this.logger.error('Invalid refresh token format');
        throw new InvalidAuthTokenException();
      }
      this.logger.error(error);
      throw error;
    }
  }

  private async generateAccessToken(payload: BasePayload): Promise<string> {
    const { signTokenPrivateKey, accessTokenExpiredIn } = this.config;
    const { exp, iat, ...customPayload } = payload as any;

    const accessTokenPayload = customPayload;
    const accessTokenSignOptions = {
      algorithm: 'RS256',
      privateKey: signTokenPrivateKey,
      expiresIn: accessTokenExpiredIn,
    } as JwtSignOptions;

    const accessToken = await this.jwtService.signAsync(
      accessTokenPayload,
      accessTokenSignOptions,
    );
    return accessToken;
  }

  private async renewRefreshToken(
    refreshSession: RefreshSession,
    oldRefreshTokenPayload: JwtPayload,
  ): Promise<string> {
    const { signTokenPrivateKey, refreshTokenExpiredIn } = this.config;

    const renewRefreshTokenPayload = {
      refreshSession: refreshSession.refreshSession,
      jti: oldRefreshTokenPayload.jti,
      sub: oldRefreshTokenPayload.sub,
      iat: Math.floor(Date.now() / 1000),
      nbf: oldRefreshTokenPayload.nbf,
    };

    const refreshTokenSignOptions = {
      algorithm: 'RS256',
      privateKey: signTokenPrivateKey,
      expiresIn: refreshTokenExpiredIn,
    } as JwtSignOptions;

    const refreshToken = await this.jwtService.signAsync(
      renewRefreshTokenPayload,
      refreshTokenSignOptions,
    );
    return refreshToken;
  }

  private async generateRefreshToken(
    payload: BasePayload,
    refreshSession: RefreshSession,
  ): Promise<string> {
    const { signTokenPrivateKey, refreshTokenExpiredIn } = this.config;

    const refreshTokenPayload = {
      refreshSession: refreshSession.refreshSession,
      jti: uuidV4(),
      sub: payload.sub,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
    };

    const refreshTokenSignOptions = {
      algorithm: 'RS256',
      privateKey: signTokenPrivateKey,
      expiresIn: refreshTokenExpiredIn,
    } as JwtSignOptions;

    const refreshToken = await this.jwtService.signAsync(
      refreshTokenPayload,
      refreshTokenSignOptions,
    );
    return refreshToken;
  }

  private async isValidRefreshToken(
    oldRefreshTokenPayload: JwtPayload,
    existedUser: UserRefreshSessionOrmEntity,
  ) {
    if (!oldRefreshTokenPayload) {
      throw new InvalidAuthTokenException();
    }
    if (
      oldRefreshTokenPayload['refreshSession'] !== existedUser.refreshSession
    ) {
      const refreshSession = RefreshSession.init('');
      await this.repo.updateRefreshSession(existedUser);
      throw new InvalidAuthTokenException();
    }
    if (Math.floor(Date.now() / 1000) >= oldRefreshTokenPayload.exp) {
      const refreshSession = RefreshSession.init('');
      await this.repo.updateRefreshSession(existedUser);
      throw new InvalidAuthTokenException();
    }
  }
}
