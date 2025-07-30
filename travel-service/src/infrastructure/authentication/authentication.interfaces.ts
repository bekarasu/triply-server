import { ExecutionContext } from '@nestjs/common';

export interface User {
  sub: string;
}

export type AuthenticationResult = boolean | Promise<boolean>;

export interface IAuthenticator {
  name: string;
  handle(
    context: ExecutionContext,
  ): AuthenticationResult | Promise<AuthenticationResult>;
}
