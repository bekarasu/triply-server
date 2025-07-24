import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IAppLogger, LoggerFactory } from '@src/infrastructure/logger';
import { Redis } from 'ioredis';
import { InvalidOtpError } from '../errors/otp.errors';
import { CONFIGS } from '@src/infrastructure/config';

export interface OtpServiceConfig {
  otpExpirationTime: number;
  otpLength: number;
  secret: string;
}

@Injectable()
export class OtpService {
  private readonly redisClient: Redis;
  private readonly logger: IAppLogger;
  private readonly config: OtpServiceConfig;

  constructor(
    redisService: RedisService,
    configService: ConfigService,
    loggerFactory: LoggerFactory,
    private readonly jwtService: JwtService,
  ) {
    this.redisClient = redisService.getOrThrow('authentication');
    this.logger = loggerFactory.createAppLogger('OtpService');
    this.config = configService.get(CONFIGS.OTP);
  }

  private generateOtpCode(): string {
    const length = this.config.otpLength;
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  async storeOtp(
    email: string,
    purpose: 'registration' | 'login' = 'registration',
  ): Promise<{ otpCode: string; otpToken: string }> {
    const otpCode = this.generateOtpCode();
    const otpToken = this.jwtService.sign(
      { email },
      {
        expiresIn: this.config.otpExpirationTime,
        secret: this.config.secret,
      },
    );
    const key = this.getOtpKey(otpToken, purpose);

    try {
      await this.redisClient.setex(key, this.config.otpExpirationTime, otpCode);
      this.logger.log(
        `OTP stored for email: ${email} with purpose: ${purpose}`,
      );
      this.logger.debug(`OTP Code: ${otpCode}`);
      // TODO send email with OTP code
      return { otpCode, otpToken };
    } catch (error) {
      this.logger.error(
        `Failed to store OTP for email: ${email}. Error: ${error.message}`,
      );
      throw error;
    }
  }

  async verifyOtp(
    otpToken: string,
    otpCode: string,
    purpose: 'registration' | 'login' = 'registration',
  ): Promise<string> {
    const key = this.getOtpKey(otpToken, purpose);

    try {
      const storedOtp = await this.redisClient.get(key);

      if (!storedOtp) {
        throw new InvalidOtpError();
      }

      const { email } = this.jwtService.verify(otpToken, {
        secret: this.config.secret,
      });

      const isValid = storedOtp === otpCode;

      if (isValid) {
        await this.redisClient.del(key);
        this.logger.log(`OTP verified successfully for email: ${otpToken}`);
      } else {
        this.logger.warn(`Invalid OTP provided for email: ${otpToken}`);
        throw new InvalidOtpError();
      }

      return email;
    } catch (error) {
      this.logger.error(
        `Failed to verify OTP: ${otpToken}. Error: ${error.message}`,
      );
      throw error;
    }
  }

  async otpExists(
    email: string,
    purpose: 'registration' | 'login' = 'registration',
  ): Promise<boolean> {
    const key = this.getOtpKey(email, purpose);

    try {
      const exists = await this.redisClient.exists(key);
      return exists === 1;
    } catch (error) {
      this.logger.error(
        `Failed to check OTP existence for email: ${email}. Error: ${error.message}`,
      );
      throw error;
    }
  }

  async getOtpTtl(
    email: string,
    purpose: 'registration' | 'login' = 'registration',
  ): Promise<number> {
    const key = this.getOtpKey(email, purpose);

    try {
      return await this.redisClient.ttl(key);
    } catch (error) {
      this.logger.error(
        `Failed to get OTP TTL for email: ${email}. Error: ${error.message}`,
      );
      throw error;
    }
  }

  private getOtpKey(token: string, purpose: string): string {
    return `otp:${purpose}:${token}`;
  }

  async clearOtp(
    email: string,
    purpose: 'registration' | 'login' = 'registration',
  ): Promise<void> {
    const key = this.getOtpKey(email, purpose);

    try {
      await this.redisClient.del(key);
      this.logger.log(
        `OTP cleared for email: ${email} with purpose: ${purpose}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to clear OTP for email: ${email}. Error: ${error.message}`,
      );
    }
  }
}
