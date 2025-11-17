import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAPI } from '@src/infrastructure/decorators';
import { SuccessResponse } from '@src/libs/responses';
import { UserTripService } from '../services/user-trip.service';
import { AuthUser, User } from '@src/infrastructure/authentication';
import { CreateUserTripDto, UserTripResponseDto } from '../dto';

@ApiTags('trips')
@Controller('trips')
@UserAPI()
export class UserTripController {
  constructor(private readonly tripService: UserTripService) {}

  @Post()
  @ApiOperation({ summary: 'Get all active cities' })
  @ApiResponse({ status: 200, description: 'List all active cities' })
  @ApiQuery({ name: 'countryId', required: false, type: Number })
  async getCities(
    @Body() trip: CreateUserTripDto,
    @AuthUser() user: User,
  ): Promise<SuccessResponse<UserTripResponseDto>> {
    trip.userId = user.sub;
    const result = await this.tripService.create(trip);

    console.log('Simulating long processing time...');
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('done');
      }, 15000);
    });

    console.log('Finished long processing time.');

    return new SuccessResponse({
      message: 'Trip created successfully',
      data: result,
    });
  }
}
