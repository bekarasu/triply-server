import { Controller, Get, HttpCode, UseInterceptors } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { HttpLoggingInterceptor } from './infrastructure/logger';

@Controller()
@UseInterceptors(HttpLoggingInterceptor)
export class AppController {
  @Get('/healthcheck')
  @HttpCode(200)
  @ApiExcludeEndpoint()
  healthcheck() {
    return 'OK';
  }
}
