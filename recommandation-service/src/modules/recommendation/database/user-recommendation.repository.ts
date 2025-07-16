import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRecommendationEntity } from './entities/user_recommendation.entity';

@Injectable()
export class UserRecommendationRepository {
  constructor(
    @InjectRepository(UserRecommendationEntity)
    private readonly repository: Repository<UserRecommendationEntity>,
  ) {}

  async findById(id: string): Promise<UserRecommendationEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<UserRecommendationEntity[]> {
    return await this.repository.find({ where: { userId } });
  }

  async findByTripId(tripId: string): Promise<UserRecommendationEntity[]> {
    return await this.repository.find({ where: { tripId } });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
