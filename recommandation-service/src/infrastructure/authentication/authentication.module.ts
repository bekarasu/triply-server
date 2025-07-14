import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserAPIAuthenticator } from './user-api.authenticator';
import { InternalAPIAuthenticator } from './internal-api.authenticator';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [UserAPIAuthenticator, InternalAPIAuthenticator],
  exports: [UserAPIAuthenticator, InternalAPIAuthenticator],
})
export class InfrasAuthenticationModule {}
