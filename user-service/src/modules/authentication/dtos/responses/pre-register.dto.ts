import { ApiProperty } from '@nestjs/swagger';

export class TriplyPreRegisterResponseDto {
  @ApiProperty()
  otpToken: string;
}
