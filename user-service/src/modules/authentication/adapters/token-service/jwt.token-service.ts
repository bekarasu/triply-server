import { Injectable } from '@nestjs/common';
import { AuthTokenService } from '@src/modules/token';
import { UserOrmEntity } from '../../database';
import { AccessTokenPayloadSerializer } from './payload-serializer';
import { AuthTokens } from './token-service.dto';
import { IAuthFlowTokenService } from './token-service.port';

export interface JwtTokenServiceConfig {
  transactionTokenKey: string;
  transactionTokenExpiredIn: number;
  redisClientName: string;
}

@Injectable()
export class JwtTokenService implements IAuthFlowTokenService {
  constructor(private readonly tokenService: AuthTokenService) {}

  async revokeToken(user: UserOrmEntity): Promise<void> {
    const userId = user.id;
    await this.tokenService.revokeTokens(userId, 'id');
  }

  async renewTokens(refreshToken: string): Promise<AuthTokens> {
    const result = await this.tokenService.renewTokens(refreshToken);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    };
  }

  async generateAuthTokens(
    payloadSerializer: AccessTokenPayloadSerializer,
  ): Promise<AuthTokens> {
    const tokens = await this.tokenService.generateTokens(payloadSerializer);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    };
  }
}
