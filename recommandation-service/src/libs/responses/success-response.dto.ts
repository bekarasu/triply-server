import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T = any> {
  @ApiProperty({
    description: 'Response status code',
    example: 200,
  })
  code: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Success',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data?: T;

  constructor(obj: { message: string; code?: number; data?: T }) {
    this.code = obj.code || 200;
    this.message = obj.message || 'Success';
    this.data = obj.data;
  }
}
