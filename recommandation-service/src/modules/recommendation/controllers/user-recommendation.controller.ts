import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser, User } from '@src/infrastructure/authentication';
import { UserAPI } from '@src/infrastructure/decorators';
import { UserRecommendationEntity } from '../database/entities/user_recommendation.entity';
import { UserRecommendationService } from '../services/user-recommendation.service';

@ApiTags('user-recommendations')
@Controller('/recommendations/me')
@UserAPI()
export class UserRecommendationController {
  constructor(
    private readonly recommendationService: UserRecommendationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all recommendations for user' })
  @ApiResponse({
    status: 200,
    description: 'List of all recommendations for user',
  })
  async getAllRecommendationsForMe(
    @AuthUser() user: User,
  ): Promise<UserRecommendationEntity[]> {
    return await this.recommendationService.getRecommendationsByUserId(
      user.sub,
    );
  }
}
