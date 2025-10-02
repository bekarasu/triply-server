export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content?: Buffer | string;
  path?: string;
  contentType?: string;
}

export interface EmailSendResult {
  messageId: string;
  success: boolean;
  error?: string;
}

export interface IEmailService {
  sendEmail(options: EmailOptions): Promise<EmailSendResult>;
}

export const EMAIL_SERVICE_PROVIDER = 'EMAIL_SERVICE_PROVIDER';
