import { RecommendationType } from '../../enums/recommendation-type.enum';

export interface UpdateRecommendationDto {
  place_name?: string;
  city_id?: string;
  recommendationType?: RecommendationType;
  score?: number;
  latitude?: number;
  longitude?: number;
  reason?: string;
  metadata?: Record<string, any>;
}
