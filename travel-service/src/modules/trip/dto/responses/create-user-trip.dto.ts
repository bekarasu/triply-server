import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RouteResponseDto {
  @ApiProperty({
    description: 'Route ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Trip ID this route belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  tripId: string;

  @ApiProperty({
    description: 'City ID for this route',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  cityId: string;

  @ApiProperty({
    description: 'Start date of this route segment',
    example: '2025-07-01T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'End date of this route segment',
    example: '2025-07-06T00:00:00.000Z',
  })
  endDate: Date;

  @ApiPropertyOptional({
    description: 'Additional route metadata',
  })
  metadata?: any;

  @ApiProperty({
    description: 'Route creation timestamp',
    example: '2025-07-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Route last update timestamp',
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

  @ApiProperty({
    description: 'User ID who owns the trip',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: 'Trip name',
    example: 'Summer Vacation 2025',
  })
  name: string;

  @ApiProperty({
    description: 'Trip start date',
    example: '2025-07-01T00:00:00.000Z',
  })
  tripStartDate: Date;

  @ApiProperty({
    description: 'Trip end date',
    example: '2025-07-15T00:00:00.000Z',
  })
  tripEndDate: Date;

  @ApiPropertyOptional({
    description: 'Additional trip metadata',
    example: { preferences: { transport: 'flight' } },
  })
  metadata?: any;

  @ApiProperty({
    description: 'Trip creation timestamp',
    example: '2025-07-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Trip last update timestamp',
    example: '2025-07-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Trip deletion timestamp (if soft deleted)',
    example: null,
  })
  deletedAt?: Date | null;

  @ApiPropertyOptional({
    description: 'Associated routes for the trip',
    type: [RouteResponseDto],
  })
  routes?: RouteResponseDto[];
}
