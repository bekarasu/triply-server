import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { InternalAPIAuthenticator } from './internal-api.authenticator';
import { UserAPIAuthenticator } from './user-api.authenticator';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [UserAPIAuthenticator, InternalAPIAuthenticator],
  exports: [UserAPIAuthenticator, InternalAPIAuthenticator],
})
export class InfrasAuthenticationModule {}
