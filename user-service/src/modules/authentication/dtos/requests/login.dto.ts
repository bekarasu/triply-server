import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LoginDto, OAuthCredentials } from '../../services/dtos/login.dto';

class TriplyLoginCredentials {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class LoginRequestDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  credentials: TriplyLoginCredentials;

  toServiceDto(): OAuthCredentials {
    return {
      email: this.credentials.email.trim().toLowerCase(),
      password: this.credentials.password,
    };
  }
}
