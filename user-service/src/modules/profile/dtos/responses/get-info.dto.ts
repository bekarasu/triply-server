import { ApiProperty } from '@nestjs/swagger';

export class GetInfoResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;
}
