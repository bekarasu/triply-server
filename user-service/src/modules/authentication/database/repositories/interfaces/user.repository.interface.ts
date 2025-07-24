import { UserOrmEntity } from '../../entities/user';

export interface IUserRepository {
  getUserById(userId: string): Promise<UserOrmEntity>;
  getUserByPhoneNumber(phoneNumber: string): Promise<UserOrmEntity>;
  getUserByEmail(email: string): Promise<UserOrmEntity>;
  create(user: UserOrmEntity): Promise<string>;
  delete(userId: string): Promise<void>;
}
