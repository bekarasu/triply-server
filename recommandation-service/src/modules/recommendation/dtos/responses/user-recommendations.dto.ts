import { UserRecommendationEntity } from '../../database/entities/user_recommendation.entity';
import { UserRecommendationDto } from './user-recommendation.dto';

export class UserRecommendationsDto extends Array<UserRecommendationDto> {
  constructor(recommendations: UserRecommendationEntity[]) {
    super(
      ...recommendations.map((rec) => {
        return {
          tripId: rec.tripId,
        };
      }),
    );
  }
}
