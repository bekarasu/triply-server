import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  REFRESH_TOKEN_SERVICE_CONFIG,
  RefreshTokenService,
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
  UserOrmEntity,
  UserOrmRepository,
} from './database';
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
      provide: REFRESH_TOKEN_SERVICE_CONFIG,
      useClass: RefreshTokenService,
    },
    {
      provide: USER_REPOSITORY,
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
