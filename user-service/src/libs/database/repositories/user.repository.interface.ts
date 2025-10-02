import { UserOrmEntity } from '../entities/user.orm-entity';

export interface IUserRepository {
  create(user: UserOrmEntity): Promise<string>;
  getUserById(id: string): Promise<UserOrmEntity | null>;
  getUserByEmail(email: string): Promise<UserOrmEntity | null>;
}
