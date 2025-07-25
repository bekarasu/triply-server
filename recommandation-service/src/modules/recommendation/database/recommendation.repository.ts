import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { RecommendationEntity } from './entities/recommendation.entity';
import { CreateRecommendationDto } from './dtos/create-recommendation.dto';
import { UpdateRecommendationDto } from './dtos/update-recommendation.dto';

@Injectable()
export class RecommendationRepository {
  constructor(
    @InjectRepository(RecommendationEntity)
    private readonly repository: Repository<RecommendationEntity>,
  ) {}

  async create(data: CreateRecommendationDto): Promise<RecommendationEntity> {
    const recommendation = this.repository.create(data);
    return await this.repository.save(recommendation);
  }

  async findAll(): Promise<RecommendationEntity[]> {
    return await this.repository.find({
      where: { deletedAt: null },
    });
  }

  async findById(id: string): Promise<RecommendationEntity | null> {
    return await this.repository.findOne({
      where: { id, deletedAt: null },
    });
  }

  async update(
    id: string,
    data: UpdateRecommendationDto,
  ): Promise<RecommendationEntity | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, {
      deletedAt: new Date(),
    });
    return result.affected > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.repository.update(id, {
      deletedAt: null,
    });
    return result.affected > 0;
  }

  async findDeleted(): Promise<RecommendationEntity[]> {
    return await this.repository.find({
      where: { deletedAt: Not(IsNull()) },
    });
  }

  async findAllIncludingDeleted(): Promise<RecommendationEntity[]> {
    return await this.repository.find();
  }

  async findByScoreRange(
    minScore: number,
    maxScore: number,
  ): Promise<RecommendationEntity[]> {
    return await this.repository
      .createQueryBuilder('recommendation')
      .where('recommendation.score BETWEEN :minScore AND :maxScore', {
        minScore,
        maxScore,
      })
      .andWhere('recommendation.deletedAt IS NULL')
      .getMany();
  }
}
