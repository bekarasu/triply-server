import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async create(user: UserOrmEntity): Promise<string> {
    const savedUser = await this.userRepository.save(user);
    return savedUser.id;
  }

  async getUserById(id: string): Promise<UserOrmEntity | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<UserOrmEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
