import { Injectable, NotFoundException } from '@nestjs/common';
import {
  RecommendationRepository,
  CreateRecommendationDto,
  UpdateRecommendationDto,
} from './database/recommendation.repository';
import { RecommendationEntity } from './database/entities/recommendation.entity';

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

  async getRecommendationsByUserId(
    userId: string,
  ): Promise<RecommendationEntity[]> {
    return await this.recommendationRepository.findByUserId(userId);
  }

  async getRecommendationsByTripId(
    tripId: string,
  ): Promise<RecommendationEntity[]> {
    return await this.recommendationRepository.findByTripId(tripId);
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

  async generateRecommendations(
    criteria: RecommendationCriteria,
  ): Promise<RecommendationEntity[]> {
    // This is a simplified recommendation algorithm
    // In a real implementation, this would involve complex ML algorithms
    const existingRecommendations = await this.getRecommendationsByUserId(
      criteria.userId,
    );

    // Return top recommendations based on score
    return existingRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  async getHighQualityRecommendations(
    minScore = 8.0,
  ): Promise<RecommendationEntity[]> {
    return await this.recommendationRepository.findByScoreRange(minScore, 10.0);
  }
}
