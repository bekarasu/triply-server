import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'OTP resent successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Email where OTP was resent',
    example: 'user@example.com',
  })
  email: string;
}
