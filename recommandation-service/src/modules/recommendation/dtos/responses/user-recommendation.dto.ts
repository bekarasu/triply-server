import { ApiProperty } from '@nestjs/swagger';

export class UserRecommendationDto {
  @ApiProperty({})
  tripId: string;
}
