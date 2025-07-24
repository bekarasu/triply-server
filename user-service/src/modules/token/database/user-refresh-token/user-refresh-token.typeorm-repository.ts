import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRefreshSessionOrmEntity } from './user-refresh-token.orm-entity';
import { IUserRefreshSessionRepository } from './user-refresh-token.repository';

@Injectable()
export class UserRefreshSessionTypeOrmRepository
  implements IUserRefreshSessionRepository
{
  constructor(
    @InjectRepository(UserRefreshSessionOrmEntity)
    protected repo: Repository<UserRefreshSessionOrmEntity>, // protected dataSource: QueryRunner,
  ) {}

  async deleteRefreshSession(refreshSessionId: string): Promise<void> {
    await this.repo.delete(refreshSessionId);
  }

  async createRefreshSession(
    userRefreshSessionEntity: UserRefreshSessionOrmEntity,
  ): Promise<UserRefreshSessionOrmEntity> {
    const updateResult = this.repo.save(userRefreshSessionEntity);

    if (!updateResult) {
      return null;
    }

    return userRefreshSessionEntity;
  }
  async updateRefreshSession(
    userRefreshSessionEntity: UserRefreshSessionOrmEntity,
  ): Promise<UserRefreshSessionOrmEntity> {
    const updateResult = await this.repo.update(userRefreshSessionEntity.id, {
      refreshSession: userRefreshSessionEntity.refreshSession,
    });

    if (!updateResult) {
      return null;
    }

    return userRefreshSessionEntity;
  }

  async getUserRefreshSessionById(
    id: string,
  ): Promise<UserRefreshSessionOrmEntity> {
    const getResult = await this.repo.findOneBy({
      id: id,
      // deletedAt: IsNull(),
    });

    if (!getResult) {
      return null;
    }
    return getResult;
  }
}
