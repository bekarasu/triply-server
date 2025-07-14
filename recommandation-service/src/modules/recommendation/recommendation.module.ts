import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { RecommendationRepository } from './database/recommendation.repository';
import { RecommendationEntity } from './database/entities/recommendation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecommendationEntity])],
  controllers: [RecommendationController],
  providers: [RecommendationService, RecommendationRepository],
})
export class RecommendationModule {}
