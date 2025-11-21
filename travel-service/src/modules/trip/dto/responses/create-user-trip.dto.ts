import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DestinationResponseDto {
  @ApiProperty({
    description: 'Destination ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Trip ID this destination belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  tripId: string;

  @ApiProperty({
    description: 'City ID for this destination',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  cityId: string;

  @ApiProperty({
    description: 'Start date of this destination segment',
    example: '2025-07-01T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'End date of this destination segment',
    example: '2025-07-06T00:00:00.000Z',
  })
  endDate: Date;

  @ApiPropertyOptional({
    description: 'Additional destination metadata',
  })
  metadata?: any;

  @ApiProperty({
    description: 'Destination creation timestamp',
    example: '2025-07-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Destination last update timestamp',
    example: '2025-07-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class UserTripResponseDto {
  @ApiProperty({
    description: 'Trip ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Associated destinations for the trip',
    type: [DestinationResponseDto],
  })
  destinations?: DestinationResponseDto[];
}
