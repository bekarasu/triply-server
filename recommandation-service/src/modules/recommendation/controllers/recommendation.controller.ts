import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecommendationEntity } from '../database/entities/recommendation.entity';
import {
  CreateRecommendationDto,
  UpdateRecommendationDto,
} from '../database/dtos';
import { RecommendationService } from '../services/recommendation.service';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new recommendation' })
  @ApiResponse({
    status: 201,
    description: 'Recommendation successfully created',
  })
  async createRecommendation(
    @Body() createRecommendationDto: CreateRecommendationDto,
  ): Promise<RecommendationEntity> {
    return await this.recommendationService.createRecommendation(
      createRecommendationDto,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a recommendation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Recommendation successfully updated',
  })
  @ApiResponse({ status: 404, description: 'Recommendation not found' })
  async updateRecommendation(
    @Param('id') id: string,
    @Body() updateRecommendationDto: UpdateRecommendationDto,
  ): Promise<RecommendationEntity> {
    return await this.recommendationService.updateRecommendation(
      id,
      updateRecommendationDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recommendation by ID' })
  @ApiResponse({
    status: 204,
    description: 'Recommendation successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Recommendation not found' })
  async deleteRecommendation(@Param('id') id: string): Promise<void> {
    return await this.recommendationService.deleteRecommendation(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all recommendations' })
  @ApiResponse({ status: 200, description: 'List of all recommendations' })
  async getAllRecommendations(): Promise<RecommendationEntity[]> {
    return await this.recommendationService.getAllRecommendations();
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
