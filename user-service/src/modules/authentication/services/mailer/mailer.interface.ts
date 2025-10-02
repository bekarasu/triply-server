import { EmailSendResult } from '@src/infrastructure/adapters/email/interfaces/email-service.interface';

export interface IMailerService {
  sendVerificationEmail(
    to: string,
    verificationCode: string,
    userName?: string,
  ): Promise<EmailSendResult>;
  sendPasswordResetEmail(
    to: string,
    resetToken: string,
    userName?: string,
  ): Promise<EmailSendResult>;
  sendWelcomeEmail(to: string, userName: string): Promise<EmailSendResult>;
}
