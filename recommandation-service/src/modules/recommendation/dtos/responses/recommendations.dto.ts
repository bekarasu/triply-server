import { RecommendationEntity } from '../../database/entities/recommendation.entity';
import { RecommendationDto } from './recommendation.dto';

export class RecommendationsDto extends Array<RecommendationDto> {
  constructor(recommendations: RecommendationEntity[]) {
    super(
      ...recommendations.map((rec) => {
        return {
          placeName: rec.place_name,
        };
      }),
    );
  }
}
