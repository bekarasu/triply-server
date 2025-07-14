import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecommendationEntity } from './database/entities/recommendation.entity';
import { RecommendationService } from './recommendation.service';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all recommendations' })
  @ApiResponse({ status: 200, description: 'List of all recommendations' })
  async getAllRecommendations(): Promise<RecommendationEntity[]> {
    return await this.recommendationService.getAllRecommendations();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get recommendations for a specific user' })
  @ApiResponse({ status: 200, description: 'User recommendations' })
  async getRecommendationsByUserId(
    @Param('userId') userId: string,
  ): Promise<RecommendationEntity[]> {
    return await this.recommendationService.getRecommendationsByUserId(userId);
  }

  @Get('trip/:tripId')
  @ApiOperation({ summary: 'Get recommendations for a specific trip' })
  @ApiResponse({ status: 200, description: 'Trip recommendations' })
  async getRecommendationsByTripId(
    @Param('tripId') tripId: string,
  ): Promise<RecommendationEntity[]> {
    return await this.recommendationService.getRecommendationsByTripId(tripId);
  }

  @Get('high-quality')
  @ApiOperation({ summary: 'Get high quality recommendations' })
  @ApiResponse({ status: 200, description: 'High quality recommendations' })
  async getHighQualityRecommendations(
    @Query('minScore') minScore?: number,
  ): Promise<RecommendationEntity[]> {
    return await this.recommendationService.getHighQualityRecommendations(
      minScore,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recommendation by ID' })
  @ApiResponse({ status: 200, description: 'Recommendation found' })
  @ApiResponse({ status: 404, description: 'Recommendation not found' })
  async getRecommendationById(
    @Param('id') id: string,
  ): Promise<RecommendationEntity> {
    return await this.recommendationService.getRecommendationById(id);
  }
}
