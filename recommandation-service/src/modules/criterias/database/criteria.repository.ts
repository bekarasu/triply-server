import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CriteriaEntity } from './entities/criteria.entity';
import { CreateCriteriaDto } from './dtos/create-criteria.dto';
import { UpdateCriteriaDto } from './dtos/update-criteria.dto';
import { CriteriaType } from '../enums/criteria-type.enum';

@Injectable()
export class CriteriaRepository {
  constructor(
    @InjectRepository(CriteriaEntity)
    private readonly repository: Repository<CriteriaEntity>,
  ) {}

  async create(data: CreateCriteriaDto): Promise<CriteriaEntity> {
    const criteria = this.repository.create(data);
    return await this.repository.save(criteria);
  }

  async findAll(): Promise<CriteriaEntity[]> {
    return await this.repository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<CriteriaEntity | null> {
    return await this.repository.findOne({
      where: { id, deletedAt: null },
    });
  }
}
