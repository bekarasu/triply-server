import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class VerifyOtpRequestDto {
  @ApiProperty({
    description: 'OTP code',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otpCode: string;

  @ApiProperty({
    description: 'OTP Token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdHBDb2RlIjoiMzI5MDUzIiwiZW1haWwiOiJidXJhay5rYXJhc3UyQHNpc2FsLmNvbSIsImlhdCI6MTc1MzEwOTQ2MywiZXhwIjoxNzUzMTA5NzYzfQ.CuPgjZh1nWW00ZDAyzbJapJeZ3oxN6zuURK1qEsVxgg',
  })
  @IsString()
  @IsNotEmpty()
  otpToken: string;
}
