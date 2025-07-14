import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationEntity } from './entities/recommendation.entity';

export interface CreateRecommendationDto {
  userId: string;
  tripId: string;
  score: number;
  reason?: string;
  recommendationType: string;
  metadata?: Record<string, any>;
}

export interface UpdateRecommendationDto {
  score?: number;
  reason?: string;
  recommendationType?: string;
  metadata?: Record<string, any>;
}

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
    return await this.repository.find();
  }

  async findById(id: string): Promise<RecommendationEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<RecommendationEntity[]> {
    return await this.repository.find({ where: { userId } });
  }

  async findByTripId(tripId: string): Promise<RecommendationEntity[]> {
    return await this.repository.find({ where: { tripId } });
  }

  async update(
    id: string,
    data: UpdateRecommendationDto,
  ): Promise<RecommendationEntity | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
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
      .getMany();
  }
}
