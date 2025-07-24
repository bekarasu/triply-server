import { UserRefreshSessionOrmEntity } from './user-refresh-token.orm-entity';

export interface IUserRefreshSessionRepository {
  getUserRefreshSessionById(id: string): Promise<UserRefreshSessionOrmEntity>;
  updateRefreshSession(
    user: UserRefreshSessionOrmEntity,
  ): Promise<UserRefreshSessionOrmEntity>;
  createRefreshSession(
    userRefreshSessionEntity: UserRefreshSessionOrmEntity,
  ): Promise<UserRefreshSessionOrmEntity>;
  deleteRefreshSession(refreshSessionId: string): Promise<void>;
}
