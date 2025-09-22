import { UserOrmEntity } from '../../entities/user';

export interface IUserRepository {
  getUserById(userId: string): Promise<UserOrmEntity>;
}
