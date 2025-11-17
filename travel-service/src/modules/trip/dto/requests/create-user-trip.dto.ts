import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
  IsNumber,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DestinationDto {
  @ApiProperty({
    description: 'City ID of the destination',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  cityId: string;

  @ApiProperty({
    description: 'Budget allocated for the destination',
    example: 1500,
  })
  @IsNotEmpty()
  @IsNumber()
  budget: number;

  @ApiProperty({
    description: 'Duration of stay at the destination in days',
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: 'List of criteria IDs for the destination',
    example: ['criteria-id-1', 'criteria-id-2'],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  criteriaIds: string[];
}

export class CreateUserTripDto {
  @ApiProperty({
    description: 'Trip start date',
    example: '2025-07-01',
  })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'List of destinations for the trip',
    type: [DestinationDto],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  destinations: DestinationDto[];

  @ApiPropertyOptional({
    description: 'Additional metadata for the trip',
    example: { preferences: { transport: 'flight' } },
  })
  @IsOptional()
  metadata?: any;

  userId: string;
}
