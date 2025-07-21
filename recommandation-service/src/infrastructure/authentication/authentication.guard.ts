import {
  Type,
  CanActivate,
  Injectable,
  OnModuleInit,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector, ModuleRef } from '@nestjs/core';
import { Observable } from 'rxjs';
import { InvalidAccessTokenException } from './authentication.errors';
import { IAuthenticator } from './authentication.interfaces';

export const BY_PASS_AUTHENTICATION_METADATA = 'allowUnauthorizedRequest';

export const AuthenticationGuard = (
  authenticatorClass: new (...args: any[]) => IAuthenticator,
): Type<CanActivate> => {
  @Injectable()
  class AuthGuardFactory implements CanActivate, OnModuleInit {
    private authenticator: IAuthenticator;
    constructor(
      private readonly reflector: Reflector,
      private readonly moduleRef: ModuleRef,
    ) {}

    onModuleInit() {
      this.authenticator = this.moduleRef.get(authenticatorClass, {
        strict: false,
      });
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const allowUnauthorizedRequest =
        this.reflector.getAllAndOverride<boolean>(
          BY_PASS_AUTHENTICATION_METADATA,
          [
            context.getClass(), // get decorator from class-scope first
            context.getHandler(), // if class-scope decorator is not found, find from method-scope
          ],
        );
      if (allowUnauthorizedRequest) {
        return true;
      }
      return this.authenticator.handle(context);
    }
  }

  return AuthGuardFactory;
};
@Injectable()
export class ProviderValidationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const provider = req.auth?.user?.provider;
    if (!provider || !provider.id || provider.type !== 'triply') {
      throw new InvalidAccessTokenException(
        'User with this provider is not authorized to access',
      );
    }
    return true;
  }
}
