import { LocalAccountOrmEntity } from '../../entities/local-account';

export interface ILocalAccountRepository {
  getUserById(userId: string): Promise<LocalAccountOrmEntity>;
  getUserByPhoneNumber(phoneNumber: string): Promise<LocalAccountOrmEntity>;
  getUserByEmail(email: string): Promise<LocalAccountOrmEntity>;
  create(user: LocalAccountOrmEntity): Promise<string>;
  delete(userId: string): Promise<void>;
}
