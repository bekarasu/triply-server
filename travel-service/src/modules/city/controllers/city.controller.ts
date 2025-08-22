import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/libs/responses';
import { CityService } from '../services/city';
import { UserAPI } from '@src/infrastructure/decorators';

@ApiTags('cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active cities' })
  @UserAPI()
  @ApiResponse({ status: 200, description: 'List all active cities' })
  async getCities(): Promise<SuccessResponse<null>> {
    return new SuccessResponse({
      message: 'Cities retrieved successfully',
    });
  }
}
