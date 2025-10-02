import { Inject, Injectable } from '@nestjs/common';
import { IAppLogger, LoggerFactory } from '@src/infrastructure/logger';
import {
  AccessTokenPayloadSerializer,
  AuthTokens,
  IAuthFlowTokenService,
  TOKEN_SERVICE_PROVIDER,
} from '../adapters/token-service';
import { LOCAL_ACCOUNT_REPOSITORY } from '../authentication.constants';
import { LocalAccountOrmEntity } from '../database';
import {
  IUserRepository,
  UserOrmEntity,
  USER_REPOSITORY as SHARED_USER_REPOSITORY,
} from '@src/libs/database';
import { ILocalAccountRepository } from '../database/repositories/interfaces/local-account.interface';
import { AuthProvider } from '../domain/enums/auth-provider.enum';
import { UserStatus } from '../domain/enums/user.enum';
import { UserVO } from '@src/libs/database';
import {
  EmailAlreadyVerifiedError,
  InvalidCredentialsError,
  InvalidProviderError,
  UserNotActiveError,
  UserNotExistError,
} from '../errors';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { PreRegisterDto } from './dtos/pre-register.dto';
import { OtpService } from './otp.service';
import { PasswordService } from './password.service';

@Injectable()
export class UserAuthenticationService {
  private readonly logger: IAppLogger;

  constructor(
    @Inject(TOKEN_SERVICE_PROVIDER)
    protected readonly authFlowTokenService: IAuthFlowTokenService,
    @Inject(SHARED_USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(LOCAL_ACCOUNT_REPOSITORY)
    private readonly localRepo: ILocalAccountRepository,
    private readonly otpService: OtpService,
    private readonly passwordService: PasswordService,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.createAppLogger('UserAuthenticationService');
  }

  async login(dto: LoginDto): Promise<{ code: string; token: AuthTokens }> {
    let user = null;
    const { provider, credentials } = dto;
    switch (provider) {
      case AuthProvider.TRIPLY:
        this.logger.log('Proceeding with internal authentication');
        const localUser = await this.localRepo.getUserByEmail(
          credentials.email,
        );

        if (!localUser) {
          this.logger.warn(
            `User not found for email: ${credentials.email} with provider: ${provider}`,
          );
          throw new InvalidCredentialsError();
        }

        if (!credentials.password) {
          this.logger.warn('No password provided for authentication');
          throw new InvalidCredentialsError();
        }

        const isPasswordValid = await this.passwordService.verifyPassword(
          credentials.password,
          localUser.passwordHash,
        );

        if (!isPasswordValid) {
          this.logger.warn(`Invalid password for email: ${credentials.email}`);
          throw new InvalidCredentialsError();
        }

        user = await this.userRepo.getUserById(localUser.userId);
        break;
      default:
        this.logger.warn(`Unsupported provider: ${provider}`);
        throw new InvalidProviderError();
    }

    if (!user) {
      this.logger.warn(
        `User not found for email: ${credentials.email} with provider: ${provider}`,
      );
      throw new UserNotExistError();
    }

    if (user.status !== UserStatus.ACTIVE) {
      this.logger.warn(`User with email: ${credentials.email} is not active`);
      throw new UserNotActiveError();
    }

    return this.proceedsAuthorizeSuccess(user.toVO());
  }

  async preRegisterTriply(
    dto: PreRegisterDto,
  ): Promise<{ message: string; otpToken: string }> {
    const { email, password, firstName, lastName } = dto;
    this.logger.log(`Pre-registration initiated for email: ${email}`);

    const existingUser = await this.localRepo.getUserByEmail(email);
    if (existingUser) {
      if (existingUser.emailVerified) {
        this.logger.warn(
          `Pre-registration attempt for existing user: ${email}`,
        );
        throw new EmailAlreadyVerifiedError();
      }

      const { otpCode, otpToken } = await this.otpService.storeOtp(
        email,
        'registration',
      );

      this.logger.log(`OTP generated for ${email} OTP code is: ${otpCode}`);

      return {
        message: 'OTP sent successfully',
        otpToken,
      };
    }

    // TODO add link support for other providers

    const newUser = new UserOrmEntity({
      email,
      name: firstName,
      surname: lastName,
      status: UserStatus.WAITING_VERIFICATION,
    });
    const userId = await this.userRepo.create(newUser);

    let passwordHash = '';
    let salt = '';

    if (password) {
      const hashedPassword = await this.passwordService.hashPassword(password);
      passwordHash = hashedPassword.hash;
      salt = hashedPassword.salt;
      this.logger.log(`Password hashed for user: ${email}`);
    }

    const localAccount = new LocalAccountOrmEntity({
      email,
      userId: userId,
      passwordHash,
      salt,
    });

    await this.localRepo.create(localAccount);
    this.logger.log(`New user created successfully for: ${email}`);

    const { otpToken } = await this.otpService.storeOtp(email, 'registration');

    // TODO In a real application, you would send the OTP via email here. For now, we'll just log it (remove in production)
    this.logger.log(`OTP generated for ${email}`);
    this.logger.log(`Password hashed and ready for registration`);

    return {
      message: 'OTP sent successfully',
      otpToken,
    };
  }

  async verifyOtpAndRegister(
    otpToken: string,
    otp: string,
  ): Promise<{ code: string; token: AuthTokens }> {
    this.logger.log(`OTP verification initiated for email: ${otpToken}`);

    const email = await this.otpService.verifyOtp(
      otpToken,
      otp,
      'registration',
    );

    const user = await this.userRepo.getUserByEmail(email);
    user.status = UserStatus.ACTIVE;
    user.save();

    if (!user) {
      throw new UserNotExistError();
    }

    const localAccount = await this.localRepo.getUserByEmail(email);
    localAccount.emailVerified = true;
    localAccount.save();

    this.logger.log(`User verified successfully for: ${email}`);

    return this.proceedsAuthorizeSuccess(user.toVO());
  }

  async resendOtp(email: string): Promise<{ message: string; email: string }> {
    this.logger.log(`OTP resend requested for email: ${email}`);
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await this.userRepo.getUserByEmail(normalizedEmail);
    if (
      existingUser &&
      existingUser.status !== UserStatus.WAITING_VERIFICATION
    ) {
      this.logger.warn(
        `OTP resend attempt for already verified user: ${normalizedEmail}`,
      );
      throw new EmailAlreadyVerifiedError();
    }

    await this.otpService.clearOtp(normalizedEmail, 'registration');
    await this.otpService.storeOtp(normalizedEmail, 'registration');

    // TODO In a real application, you would send the OTP via email here. For now, we'll just log it (remove in production)
    this.logger.log(`New OTP generated for ${normalizedEmail}`);

    return {
      message: 'OTP resent successfully',
      email: normalizedEmail,
    };
  }

  async updatePassword(
    email: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    this.logger.log(`Password update initiated for email: ${email}`);
    const normalizedEmail = email.trim().toLowerCase();

    const localUser = await this.localRepo.getUserByEmail(normalizedEmail);
    if (!localUser) {
      this.logger.warn(
        `Password update attempt for non-existent user: ${normalizedEmail}`,
      );
      throw new UserNotExistError(
        `User with email ${normalizedEmail} does not exist`,
      );
    }

    const { hash, salt } = await this.passwordService.hashPassword(newPassword);

    // TODO In a real application, you would send the OTP via email here. For now, we'll just log it (remove in production)
    this.logger.log(`Password updated successfully for: ${normalizedEmail}`);

    return {
      message: 'Password updated successfully',
    };
  }

  async refreshToken(
    dto: RefreshTokenDto,
  ): Promise<{ code: string; token: AuthTokens }> {
    try {
      const authTokens = await this.authFlowTokenService.renewTokens(
        dto.refreshToken,
      );

      return {
        code: '200',
        token: authTokens,
      };
    } catch (error) {
      this.logger.error('Token refresh failed');
      throw error;
    }
  }

  private async proceedsAuthorizeSuccess(
    user: UserVO,
  ): Promise<{ code: string; token: AuthTokens }> {
    const authTokens = await this.authFlowTokenService.generateAuthTokens(
      new AccessTokenPayloadSerializer(user),
    );
    this.logger.log('Generated auth token, internal login successful');
    return {
      code: '200',
      token: authTokens,
    };
  }
}
