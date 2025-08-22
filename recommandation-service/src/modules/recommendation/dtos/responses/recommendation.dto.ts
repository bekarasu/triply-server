import { ApiProperty } from '@nestjs/swagger';

export class RecommendationDto {
  @ApiProperty()
  placeName: string;

  constructor(props) {
    this.placeName = props.placeName || '';
  }
}
