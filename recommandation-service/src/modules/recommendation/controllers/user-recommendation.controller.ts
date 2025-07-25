import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser, User } from '@src/infrastructure/authentication';
import { UserAPI } from '@src/infrastructure/decorators';
import { SuccessResponse } from '@src/libs/responses';
import { UserRecommendationsDto } from '../dtos/responses/user-recommendations.dto';
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
    type: SuccessResponse<UserRecommendationsDto>,
  })
  async getAllRecommendationsForMe(
    @AuthUser() user: User,
  ): Promise<SuccessResponse<UserRecommendationsDto>> {
    const recommendations =
      await this.recommendationService.getRecommendationsByUserId(user.sub);
    return new SuccessResponse({
      message: 'Recommendations retrieved successfully',
      data: new UserRecommendationsDto(recommendations),
    });
  }
}
