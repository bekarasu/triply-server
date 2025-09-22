import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../token';
import { USER_REPOSITORY } from './profile.constants';
import { ProfileController } from './profile.controller';
import { UserOrmEntity, UserOrmRepository } from './database';
import { ProfileService } from './services/profile.service';
import { UserAPIAuthenticator } from '@src/infrastructure/authentication';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.register({}),
    TokenModule,
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserOrmRepository,
    },
    UserAPIAuthenticator,
    ProfileService,
  ],
  controllers: [ProfileController],
})
export class ProfileModule {}
