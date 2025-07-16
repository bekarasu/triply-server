import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateRecommendationDto,
  UpdateRecommendationDto,
} from '../database/dtos';
import { RecommendationEntity } from '../database/entities/recommendation.entity';
import { RecommendationRepository } from '../database/recommendation.repository';

export interface RecommendationCriteria {
  userId: string;
  preferences?: Record<string, any>;
  budget?: { min: number; max: number };
  travelStyle?: string[];
}

@Injectable()
export class RecommendationService {
  constructor(
    private readonly recommendationRepository: RecommendationRepository,
  ) {}

  async createRecommendation(
    data: CreateRecommendationDto,
  ): Promise<RecommendationEntity> {
    return await this.recommendationRepository.create(data);
  }

  async getAllRecommendations(): Promise<RecommendationEntity[]> {
    return await this.recommendationRepository.findAll();
  }

  async getRecommendationById(id: string): Promise<RecommendationEntity> {
    const recommendation = await this.recommendationRepository.findById(id);
    if (!recommendation) {
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }
    return recommendation;
  }

  async updateRecommendation(
    id: string,
    data: UpdateRecommendationDto,
  ): Promise<RecommendationEntity> {
    const updated = await this.recommendationRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }
    return updated;
  }

  async deleteRecommendation(id: string): Promise<void> {
    const deleted = await this.recommendationRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }
  }

  async getHighQualityRecommendations(
    minScore = 8.0,
  ): Promise<RecommendationEntity[]> {
    return await this.recommendationRepository.findByScoreRange(minScore, 10.0);
  }
}
