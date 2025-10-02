import { Injectable, Inject } from '@nestjs/common';
import {
  IEmailService,
  EMAIL_SERVICE_PROVIDER,
  EmailOptions,
  EmailSendResult,
} from '@src/infrastructure/adapters/email';
import { IAppLogger, LoggerFactory } from '@src/infrastructure/logger';

@Injectable()
export class EmailNotificationService {
  private readonly logger: IAppLogger;

  constructor(
    @Inject(EMAIL_SERVICE_PROVIDER)
    private readonly emailService: IEmailService,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.createAppLogger('EmailNotificationService');
  }

  async sendOTPEmail(
    email: string,
    otpCode: string,
    purpose: string,
  ): Promise<EmailSendResult> {
    const emailOptions: EmailOptions = {
      to: email,
      subject: `Your OTP Code for ${purpose}`,
      html: `
        <h2>Your OTP Code</h2>
        <p>Your verification code is: <strong>${otpCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `,
      text: `Your verification code is: ${otpCode}. This code will expire in 10 minutes.`,
    };

    this.logger.log(`Sending OTP email to ${email} for purpose: ${purpose}`);

    try {
      const result = await this.emailService.sendEmail(emailOptions);

      if (result.success) {
        this.logger.log(`OTP email sent successfully to ${email}`);
      } else {
        this.logger.error(
          `Failed to send OTP email to ${email}: ${result.error}`,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(
        `Error sending OTP email to ${email}: ${error.message}`,
      );
      return {
        messageId: '',
        success: false,
        error: error.message,
      };
    }
  }

  async sendWelcomeEmail(
    email: string,
    name: string,
  ): Promise<EmailSendResult> {
    const emailOptions: EmailOptions = {
      to: email,
      subject: 'Welcome to our platform!',
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for joining our platform. We're excited to have you on board!</p>
        <p>Get started by exploring our features and let us know if you need any help.</p>
      `,
      text: `Welcome, ${name}! Thank you for joining our platform. We're excited to have you on board!`,
    };

    this.logger.log(`Sending welcome email to ${email}`);

    try {
      const result = await this.emailService.sendEmail(emailOptions);

      if (result.success) {
        this.logger.log(`Welcome email sent successfully to ${email}`);
      } else {
        this.logger.error(
          `Failed to send welcome email to ${email}: ${result.error}`,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(
        `Error sending welcome email to ${email}: ${error.message}`,
      );
      return {
        messageId: '',
        success: false,
        error: error.message,
      };
    }
  }
}
