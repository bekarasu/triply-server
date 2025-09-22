import { Controller, Get } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser, User } from '@src/infrastructure/authentication';
import { UserAPI } from '@src/infrastructure/decorators';
import { SuccessResponse } from '@src/libs/responses';
import { GetInfoResponseDto } from './dtos/responses/get-info.dto';
import { ProfileService } from './services/profile.service';

@ApiTags('profile-me')
@Controller('profile/me')
@UserAPI()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get Profile Info' })
  @ApiBody({})
  @ApiResponse({
    status: 200,
    description: 'Get Info successful',
    type: SuccessResponse<GetInfoResponseDto>,
  })
  async getInfo(
    @AuthUser() user: User,
  ): Promise<SuccessResponse<GetInfoResponseDto>> {
    const result = await this.profileService.getInfo(user.sub);
    const getInfoData: GetInfoResponseDto = {
      email: result.email,
      name: result.name,
      surname: result.surname,
      phoneNumber: result.phoneNumber || '',
    };
    return new SuccessResponse({
      message: 'Get Info successful',
      data: getInfoData,
    });
  }
}
