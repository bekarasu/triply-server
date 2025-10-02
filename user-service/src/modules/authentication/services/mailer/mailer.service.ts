import { Injectable } from '@nestjs/common';
import { GoogleSMTPService } from '@src/infrastructure/adapters/email/google-smtp/google-smtp.service';
import { EmailSendResult } from '@src/infrastructure/adapters/email/interfaces/email-service.interface';
import { IAppLogger, LoggerFactory } from '@src/infrastructure/logger';
import { IMailerService } from './mailer.interface';

@Injectable()
export class MailerService implements IMailerService {
  private readonly logger: IAppLogger;

  constructor(
    private readonly mailDriver: GoogleSMTPService,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.createAppLogger('MailerService');
  }

  async sendVerificationEmail(
    to: string,
    verificationCode: string,
    userName?: string,
  ): Promise<EmailSendResult> {
    const displayName = userName || 'User';
    const subject = 'Email Verification - Triply';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Hello ${displayName},</p>
        <p>Thank you for signing up! Please use the verification code below to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 4px;">${verificationCode}</h1>
        </div>
        <p>This code will expire in 10 minutes for security reasons.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message from Triply. Please do not reply to this email.</p>
      </div>
    `;

    const text = `
      Hello ${displayName},
      
      Thank you for signing up! Please use the verification code below to verify your email address:
      
      Verification Code: ${verificationCode}
      
      This code will expire in 10 minutes for security reasons.
      
      If you didn't create an account with us, please ignore this email.
    `;

    return this.mailDriver.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }

  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
    userName?: string,
  ): Promise<EmailSendResult> {
    const displayName = userName || 'User';
    const subject = 'Password Reset - Triply';

    // Note: You should replace this with your actual frontend URL
    const resetUrl = `${process.env.FRONTEND_URL || 'https://your-app.com'}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${displayName},</p>
        <p>You have requested to reset your password. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message from Triply. Please do not reply to this email.</p>
      </div>
    `;

    const text = `
      Hello ${displayName},
      
      You have requested to reset your password. Please visit the following link to reset your password:
      
      ${resetUrl}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    `;

    return this.mailDriver.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }

  async sendWelcomeEmail(
    to: string,
    userName: string,
  ): Promise<EmailSendResult> {
    const subject = 'Welcome to Triply!';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Triply!</h2>
        <p>Hello ${userName},</p>
        <p>Welcome to Triply! We're excited to have you on board.</p>
        <p>You can now start exploring our features and planning your trips with ease.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://your-app.com'}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Get Started</a>
        </div>
        <p>If you have any questions or need assistance, feel free to contact our support team.</p>
        <p>Happy traveling!</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message from Triply. Please do not reply to this email.</p>
      </div>
    `;

    const text = `
      Hello ${userName},
      
      Welcome to Triply! We're excited to have you on board.
      
      You can now start exploring our features and planning your trips with ease.
            
      If you have any questions or need assistance, feel free to contact our support team.
      
      Happy traveling!
    `;

    return this.mailDriver.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }
}
