import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserRefreshSessionOrmEntity,
  UserRefreshSessionTypeOrmRepository,
} from './database/user-refresh-token';
import { RefreshTokenService } from './services/refresh-token';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRefreshSessionOrmEntity]),
    JwtModule.register({}),
  ],
  providers: [
    {
      provide: 'IUserRefreshSessionRepository',
      useClass: UserRefreshSessionTypeOrmRepository,
    },
    RefreshTokenService,
  ],
  exports: [RefreshTokenService, 'IUserRefreshSessionRepository'],
})
export class TokenModule {}
