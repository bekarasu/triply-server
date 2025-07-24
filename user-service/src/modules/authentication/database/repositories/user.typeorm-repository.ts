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

  async getUserByEmail(email: string): Promise<UserOrmEntity | null> {
    const dbUser = await this.userRepo.findOne({
      where: {
        email,
      },
    });
    if (!dbUser) {
      return null;
    }

    return dbUser;
  }

  async getUserByPhoneNumber(
    phoneNumber: string,
  ): Promise<UserOrmEntity | null> {
    const dbUser = await this.userRepo.findOne({
      where: {
        phoneNumber,
      },
    });
    if (!dbUser) {
      return null;
    }

    return dbUser;
  }

  async create(user: UserOrmEntity): Promise<string> {
    const newUser = await this.userRepo.save(user);
    return newUser.id;
  }

  async delete(userId: string): Promise<void> {
    await this.userRepo.delete(userId);
  }
}
