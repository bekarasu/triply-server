import { Inject, Injectable } from '@nestjs/common';
import { IAppLogger, LoggerFactory } from '@src/infrastructure/logger';
import { IUserRepository, UserOrmEntity } from '../database';
import { USER_REPOSITORY } from '../profile.constants';

@Injectable()
export class ProfileService {
  private readonly logger: IAppLogger;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.createAppLogger('ProfileService');
  }

  async getInfo(userId: string): Promise<UserOrmEntity> {
    if (!userId) {
      this.logger.warn(`User not found for id: ${userId}`);
      throw new Error('User not found');
    }

    const user = await this.userRepo.getUserById(userId);
    if (!user) {
      this.logger.warn(`User not found for id: ${userId}`);
      throw new Error('User not found');
    }

    return user;
  }
}
