import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserAuthenticationService } from './services/authentication.service';
import { PublicAPI } from '@src/infrastructure/decorators';
import { SuccessResponse } from '@src/libs/responses';
import { LoginRequestDto } from './dtos/requests/login.dto';
import { LoginResponseDto } from './dtos/responses/login.dto';
import { TriplyPreRegisterRequestDto } from './dtos/requests/pre-register.dto';
import { TriplyPreRegisterResponseDto } from './dtos/responses/pre-register.dto';
import { VerifyOtpRequestDto } from './dtos/requests/verify-otp.dto';
import { ResendOtpRequestDto } from './dtos/requests/resend-otp.dto';
import { ResendOtpResponseDto } from './dtos/responses/resend-otp.dto';
import { RefreshTokenRequestDto } from './dtos/requests/refresh-token.dto';
import { LoginDto } from './services/dtos/login.dto';
import { RefreshTokenDto } from './services/dtos/refresh-token.dto';

@ApiTags('authentication')
@Controller('authentication')
@PublicAPI()
export class AuthenticationController {
  constructor(
    private readonly authenticationService: UserAuthenticationService,
  ) {}

  @Post(':provider/login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    schema: {
      oneOf: [{ $ref: getSchemaPath(LoginRequestDto) }],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: SuccessResponse<LoginResponseDto>,
  })
  async login(
    @Param('provider') provider: string,
    @Body() body: LoginRequestDto,
  ): Promise<SuccessResponse<LoginResponseDto>> {
    const loginDto: LoginDto = {
      provider,
      credentials: body.toServiceDto(),
    };
    const result = await this.authenticationService.login(loginDto);
    const loginData: LoginResponseDto = {
      token: {
        accessToken: result.token.accessToken,
        refreshToken: result.token.refreshToken,
        expiresIn: result.token.expiresIn,
      },
    };
    return new SuccessResponse({
      message: 'Login successful',
      data: loginData,
    });
  }

  @Post('triply/pre-register')
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: TriplyPreRegisterRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Pre-registration successful, OTP sent',
    type: SuccessResponse<TriplyPreRegisterResponseDto>,
  })
  async register(
    @Body() body: TriplyPreRegisterRequestDto,
  ): Promise<SuccessResponse<TriplyPreRegisterResponseDto>> {
    const result = await this.authenticationService.preRegisterTriply(
      body.toServiceDto(),
    );
    return new SuccessResponse({
      message: result.message,
      data: {
        otpToken: result.otpToken,
      },
    });
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and Complete Registration' })
  @ApiBody({ type: VerifyOtpRequestDto })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully, user authenticated',
    type: SuccessResponse<LoginResponseDto>,
  })
  async verifyOtp(
    @Body() body: VerifyOtpRequestDto,
  ): Promise<SuccessResponse<LoginResponseDto>> {
    // TODO add requestId for extra security on verify
    const result = await this.authenticationService.verifyOtpAndRegister(
      body.otpToken,
      body.otpCode,
    );
    const loginData: LoginResponseDto = {
      token: {
        accessToken: result.token.accessToken,
        refreshToken: result.token.refreshToken,
        expiresIn: result.token.expiresIn,
      },
    };
    return new SuccessResponse({
      message: 'OTP verified successfully',
      data: loginData,
    });
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP' })
  @ApiBody({ type: ResendOtpRequestDto })
  @ApiResponse({
    status: 200,
    description: 'OTP resent successfully',
    type: SuccessResponse<ResendOtpResponseDto>,
  })
  async resendOtp(
    @Body() body: ResendOtpRequestDto,
  ): Promise<SuccessResponse<ResendOtpResponseDto>> {
    const result = await this.authenticationService.resendOtp(body.email);
    return new SuccessResponse({
      message: result.message,
      data: {
        message: result.message,
        email: result.email,
      },
    });
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: SuccessResponse<LoginResponseDto>,
  })
  async refreshToken(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<SuccessResponse<LoginResponseDto>> {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: body.refreshToken,
    };

    const result =
      await this.authenticationService.refreshToken(refreshTokenDto);
    const loginData: LoginResponseDto = {
      token: {
        accessToken: result.token.accessToken,
        refreshToken: result.token.refreshToken,
        expiresIn: result.token.expiresIn,
      },
    };

    return new SuccessResponse({
      message: 'Token refreshed successfully',
      data: loginData,
    });
  }
}
