import { AuthTokens } from './refresh-token.dto';

export interface IPayloadSerializer<T extends BasePayload> {
  serialize(): T | Promise<T>;
}

export interface BasePayload {
  sub: string;
}

export interface IRefreshTokenService {
  generateTokens(
    payloadSerializer: IPayloadSerializer<BasePayload>,
  ): Promise<AuthTokens | Error>;
  renewTokens(refreshToken: string): Promise<AuthTokens | Error>;
  revokeTokens(refreshToken: string): Promise<void | Error>;
}
