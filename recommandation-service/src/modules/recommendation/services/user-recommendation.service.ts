import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRecommendationRepository } from '../database/user-recommendation.repository';
import { UserRecommendationEntity } from './../database/entities/user_recommendation.entity';

export interface RecommendationCriteria {
  userId: string;
  preferences?: Record<string, any>;
  budget?: { min: number; max: number };
  travelStyle?: string[];
}

@Injectable()
export class UserRecommendationService {
  constructor(private readonly userRecRepo: UserRecommendationRepository) {}

  async getRecommendationById(id: string): Promise<UserRecommendationEntity> {
    const recommendation = await this.userRecRepo.findById(id);
    if (!recommendation) {
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }
    return recommendation;
  }

  async getRecommendationsByUserId(
    userId: string,
  ): Promise<UserRecommendationEntity[]> {
    return await this.userRecRepo.findByUserId(userId);
  }

  async getRecommendationsByTripId(
    tripId: string,
  ): Promise<UserRecommendationEntity[]> {
    return await this.userRecRepo.findByTripId(tripId);
  }

  async deleteRecommendation(id: string): Promise<void> {
    const deleted = await this.userRecRepo.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Recommendation with ID ${id} not found`);
    }
  }
}
