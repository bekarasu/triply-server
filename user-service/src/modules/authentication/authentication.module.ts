import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AuthTokenService,
  AUTH_TOKEN_SERVICE_CONFIG,
  TokenModule,
} from '../token';
import {
  JwtTokenService,
  TOKEN_SERVICE_PROVIDER,
} from './adapters/token-service';
import {
  LOCAL_ACCOUNT_REPOSITORY,
  USER_REPOSITORY,
} from './authentication.constants';
import { AuthenticationController } from './authentication.controller';
import { UserAuthenticationService } from './services/authentication.service';
import {
  LocalAccountOrmEntity,
  ProviderAccountOrmEntity,
  RefreshSessionOrmEntity,
} from './database';
import {
  UserOrmEntity,
  UserOrmRepository,
  USER_REPOSITORY as SHARED_USER_REPOSITORY,
} from '@src/libs/database';
import { LocalAccountOrmRepository } from './database/repositories/local-account.typeorm-repository';
import { OtpService, PasswordService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      RefreshSessionOrmEntity,
      ProviderAccountOrmEntity,
      LocalAccountOrmEntity,
    ]),
    JwtModule.register({}),
    TokenModule,
  ],
  providers: [
    {
      provide: TOKEN_SERVICE_PROVIDER,
      useClass: JwtTokenService,
    },
    {
      provide: AUTH_TOKEN_SERVICE_CONFIG,
      useClass: AuthTokenService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserOrmRepository,
    },
    {
      provide: SHARED_USER_REPOSITORY,
      useClass: UserOrmRepository,
    },
    {
      provide: LOCAL_ACCOUNT_REPOSITORY,
      useClass: LocalAccountOrmRepository,
    },
    UserAuthenticationService,
    OtpService,
    PasswordService,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
