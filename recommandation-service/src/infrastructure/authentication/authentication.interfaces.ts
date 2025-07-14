import { ExecutionContext } from '@nestjs/common';

export interface UserProvider {
  id: string;
  type: string;
}
export interface GameUser {
  userId: string;
  profileId: string;
  provider?: UserProvider;
}

export interface CMSUser {
  userId: string;
  email: string;
}

export type AuthenticationResult = boolean | Promise<boolean>;

export interface IAuthenticator {
  name: string;
  handle(
    context: ExecutionContext,
  ): AuthenticationResult | Promise<AuthenticationResult>;
}
