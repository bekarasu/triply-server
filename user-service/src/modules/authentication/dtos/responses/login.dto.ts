import { ApiProperty } from '@nestjs/swagger';

class Token {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;
}

export class LoginResponseDto {
  @ApiProperty({ type: Token })
  token: Token;
}
