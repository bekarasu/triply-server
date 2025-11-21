import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsValidDateString } from '@src/libs/validations/is-valid-date-string.validator';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class DestinationDto {
  @ApiProperty({
    description: 'City ID of the destination',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'City ID is required' })
  @IsNumber({}, { message: 'City ID must be a number' })
  @Min(1, { message: 'City ID must be a positive number' })
  cityId: number;

  @ApiProperty({
    description: 'Budget allocated for the destination',
    example: 1500,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'Budget is required' })
  @IsNumber({}, { message: 'Budget must be a number' })
  @IsPositive({ message: 'Budget must be a positive number' })
  @Min(0, { message: 'Budget must be at least 0' })
  @Max(1000000, { message: 'Budget cannot exceed 1,000,000' })
  budget: number;

  @ApiProperty({
    description: 'Duration of stay at the destination in days',
    example: 5,
    minimum: 1,
    maximum: 365,
  })
  @IsNotEmpty({ message: 'Duration is required' })
  @IsNumber({}, { message: 'Duration must be a number' })
  @IsPositive({ message: 'Duration must be a positive number' })
  @Min(1, { message: 'Duration must be at least 1 day' })
  @Max(365, { message: 'Duration cannot exceed 365 days' })
  duration: number;

  @ApiProperty({
    description: 'List of criteria IDs for the destination',
    example: ['criteria-id-1', 'criteria-id-2'],
    isArray: true,
  })
  @IsNotEmpty({ message: 'Criteria IDs are required' })
  @IsArray({ message: 'Criteria IDs must be an array' })
  @ArrayMinSize(1, { message: 'At least one criteria ID is required' })
  @IsString({ each: true, message: 'Each criteria ID must be a string' })
  @IsUUID('4', {
    each: true,
    message: 'Each criteria ID must be a valid UUID v4',
  })
  criteriaIds: string[];
}

export class CreateUserTripDto {
  @ApiProperty({
    description: 'Trip start date',
    example: '2025-07-01',
  })
  @IsNotEmpty({ message: 'Start date is required' })
  @IsValidDateString({
    message: 'Start date must be a valid date in YYYY-MM-DD format',
  })
  startDate: string;

  @ApiProperty({
    description: 'List of destinations for the trip',
    type: [DestinationDto],
  })
  @IsNotEmpty({ message: 'Destinations are required' })
  @IsArray({ message: 'Destinations must be an array' })
  @ArrayMinSize(1, { message: 'At least one destination is required' })
  @ValidateNested({ each: true })
  @Type(() => DestinationDto)
  destinations: DestinationDto[];

  @ApiPropertyOptional({
    description: 'Additional metadata for the trip',
    example: { preferences: { transport: 'flight' } },
  })
  @IsOptional()
  metadata?: any;

  userId: string;
}
