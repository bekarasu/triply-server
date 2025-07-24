import { UserVO } from '../../../domain/value-objects/user';
import { BasePayload, IPayloadSerializer } from '@src/modules/token';

export interface AuthTokenPayload extends BasePayload {
  sub: string;
  provider: {
    sub: string;
  };
}

export class AccessTokenPayloadSerializer
  implements IPayloadSerializer<AuthTokenPayload>
{
  protected readonly payload: AuthTokenPayload;

  constructor(user: UserVO) {
    this.payload = {
      sub: user.id,
      provider: {
        sub: user.id,
      },
    };
  }

  serialize(): AuthTokenPayload {
    return this.payload;
  }
}
