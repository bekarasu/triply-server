import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCriteriaDto, UpdateCriteriaDto } from '../database/dtos';
import { CriteriaEntity } from '../database/entities/criteria.entity';
import { CriteriaRepository } from '../database/criteria.repository';
import { CriteriaType } from '../enums/criteria-type.enum';

@Injectable()
export class CriteriaService {
  constructor(private readonly criteriaRepository: CriteriaRepository) {}

  async createCriteria(data: CreateCriteriaDto): Promise<CriteriaEntity> {
    return await this.criteriaRepository.create(data);
  }

  async getAllCriterias(): Promise<CriteriaEntity[]> {
    return await this.criteriaRepository.findAll();
  }

  async getCriteriaById(id: string): Promise<CriteriaEntity> {
    const criteria = await this.criteriaRepository.findById(id);
    if (!criteria) {
      throw new NotFoundException(`Criteria with ID ${id} not found`);
    }
    return criteria;
  }
}
