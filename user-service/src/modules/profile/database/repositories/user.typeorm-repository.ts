import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserOrmEntity } from '../entities/user';
import { IUserRepository } from './interfaces/user.repository.interface';

@Injectable()
export class UserOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    protected userRepo: Repository<UserOrmEntity>,
  ) {}

  async getUserById(userId: string): Promise<UserOrmEntity | null> {
    const userDb = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });
    if (!userDb) {
      return null;
    }

    return userDb;
  }
}
