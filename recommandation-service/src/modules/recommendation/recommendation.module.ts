import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationController } from './controllers/recommendation.controller';
import { UserRecommendationController } from './controllers/user-recommendation.controller';
import { RecommendationEntity } from './database/entities/recommendation.entity';
import { UserRecommendationEntity } from './database/entities/user_recommendation.entity';
import { RecommendationRepository } from './database/recommendation.repository';
import { UserRecommendationRepository } from './database/user-recommendation.repository';
import { RecommendationService } from './services/recommendation.service';
import { UserRecommendationService } from './services/user-recommendation.service';

const controllers = [UserRecommendationController, RecommendationController];
const repositories = [RecommendationRepository, UserRecommendationRepository];
const services = [RecommendationService, UserRecommendationService];
const entities = [RecommendationEntity, UserRecommendationEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers,
  providers: [...services, ...repositories],
})
export class RecommendationModule {}
