import { RecommendationType } from '../../enums/recommendation-type.enum';

export interface CreateRecommendationDto {
  id: string;
  place_name: string;
  city_id: string;
  recommendationType: RecommendationType;
  score: number;
  latitude: number;
  longitude: number;
  reason?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
