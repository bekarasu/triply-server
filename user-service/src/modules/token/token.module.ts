import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserRefreshSessionOrmEntity,
  UserRefreshSessionTypeOrmRepository,
} from './database/user-refresh-token';
import { AuthTokenService } from './services/auth-token';
import {
  UserOrmEntity,
  UserOrmRepository,
  USER_REPOSITORY,
} from '@src/libs/database';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRefreshSessionOrmEntity, UserOrmEntity]),
    JwtModule.register({}),
  ],
  providers: [
    {
      provide: 'IUserRefreshSessionRepository',
      useClass: UserRefreshSessionTypeOrmRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserOrmRepository,
    },
    AuthTokenService,
  ],
  exports: [AuthTokenService, 'IUserRefreshSessionRepository', USER_REPOSITORY],
})
export class TokenModule {}
