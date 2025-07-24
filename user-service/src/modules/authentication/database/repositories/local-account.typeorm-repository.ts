import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LocalAccountOrmEntity } from '../entities/local-account';
import { ILocalAccountRepository } from './interfaces/local-account.interface';

@Injectable()
export class LocalAccountOrmRepository implements ILocalAccountRepository {
  constructor(
    @InjectRepository(LocalAccountOrmEntity)
    protected userRepo: Repository<LocalAccountOrmEntity>,
  ) {}

  async getUserById(userId: string): Promise<LocalAccountOrmEntity | null> {
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

  async getUserByEmail(email: string): Promise<LocalAccountOrmEntity | null> {
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
  ): Promise<LocalAccountOrmEntity | null> {
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

  async create(user: LocalAccountOrmEntity): Promise<string> {
    const newUser = await this.userRepo.save(user);
    return newUser.id;
  }

  async delete(userId: string): Promise<void> {
    await this.userRepo.delete(userId);
  }
}
