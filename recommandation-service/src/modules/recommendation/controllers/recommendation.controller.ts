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
import { SuccessResponse } from '@src/libs/responses';
import { RecommendationsDto } from '../dtos/responses/recommendations.dto';
import { RecommendationDto } from '../dtos/responses/recommendation.dto';

@ApiTags('recommendations')
@Controller('recommendations')
// TODO it should be CMS API
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  @ApiOperation({ summary: 'Manually -- Create a new recommendation' })
  @ApiResponse({
    status: 201,
    description: 'Recommendation successfully created',
    type: SuccessResponse,
  })
  async createRecommendation(
    @Body() createRecommendationDto: CreateRecommendationDto,
  ): Promise<SuccessResponse> {
    await this.recommendationService.createRecommendation(
      createRecommendationDto,
    );
    return new SuccessResponse({
      message: 'Recommendation created successfully',
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Manually -- Update a recommendation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Recommendation successfully updated',
    type: SuccessResponse,
  })
  @ApiResponse({ status: 404, description: 'Recommendation not found' })
  async updateRecommendation(
    @Param('id') id: string,
    @Body() updateRecommendationDto: UpdateRecommendationDto,
  ): Promise<SuccessResponse> {
    await this.recommendationService.updateRecommendation(
      id,
      updateRecommendationDto,
    );

    return new SuccessResponse({
      message: 'Recommendation updated successfully',
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Manually -- delete a recommendation by ID' })
  @ApiResponse({
    status: 204,
    description: 'Recommendation successfully deleted',
    type: SuccessResponse,
  })
  @ApiResponse({ status: 404, description: 'Recommendation not found' })
  async deleteRecommendation(
    @Param('id') id: string,
  ): Promise<SuccessResponse> {
    await this.recommendationService.deleteRecommendation(id);

    return new SuccessResponse({
      message: 'Recommendation deleted successfully',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all recommendations' })
  @ApiResponse({ status: 200, description: 'List of all recommendations' })
  async getAllRecommendations(): Promise<SuccessResponse<RecommendationsDto>> {
    const recommendations =
      await this.recommendationService.getAllRecommendations();

    return new SuccessResponse({
      message: 'Recommendations retrieved successfully',
      data: new RecommendationsDto(recommendations),
    });
  }

  @Get('high-quality')
  @ApiOperation({ summary: 'Get high quality recommendations' })
  @ApiResponse({ status: 200, description: 'High quality recommendations' })
  async getHighQualityRecommendations(
    @Query('minScore') minScore?: number,
  ): Promise<SuccessResponse<RecommendationsDto>> {
    const highRecommendations =
      await this.recommendationService.getHighQualityRecommendations(minScore);

    return new SuccessResponse({
      message: 'High quality recommendations retrieved successfully',
      data: new RecommendationsDto(highRecommendations),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recommendation by ID' })
  @ApiResponse({ status: 200, description: 'Recommendation found' })
  @ApiResponse({ status: 404, description: 'Recommendation not found' })
  async getRecommendationById(
    @Param('id') id: string,
  ): Promise<SuccessResponse<RecommendationDto>> {
    const recommendation =
      await this.recommendationService.getRecommendationById(id);

    return new SuccessResponse({
      message: 'Recommendation retrieved successfully',
      data: new RecommendationDto(recommendation),
    });
  }
}
