import { UserOrmEntity } from '../../database';
import { AccessTokenPayloadSerializer } from './payload-serializer';
import { AuthTokens } from './token-service.dto';

export interface IAuthFlowTokenService {
  generateAuthTokens(
    payloadSerializer: AccessTokenPayloadSerializer,
  ): Promise<AuthTokens>;
  renewTokens(refreshToken: string): Promise<AuthTokens>;
  revokeToken(user: UserOrmEntity): Promise<void>;
}
