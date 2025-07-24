import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  MaxLength,
} from 'class-validator';
import { PreRegisterDto } from '../../services/dtos/pre-register.dto';
import { MatchPassword } from '@src/infrastructure/validation/decorators';

export class TriplyPreRegisterRequestDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5, { message: 'Email must be at least 5 characters long' })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MatchPassword('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  firstName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  lastName: string;

  toServiceDto(): PreRegisterDto {
    return {
      provider: 'triply', // Default provider for now
      email: this.email.trim().toLowerCase(),
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}
