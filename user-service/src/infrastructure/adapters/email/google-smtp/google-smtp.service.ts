import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IAppLogger, LoggerFactory } from '@src/infrastructure/logger';
import {
  EmailOptions,
  EmailSendResult,
  IEmailService,
} from '../interfaces/email-service.interface';
import {
  GOOGLE_SMTP_CONFIG_PROVIDER,
  GoogleSMTPConfig,
} from './google-smtp.config';

@Injectable()
export class GoogleSMTPService implements IEmailService {
  private readonly logger: IAppLogger;
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(GOOGLE_SMTP_CONFIG_PROVIDER)
    private readonly config: GoogleSMTPConfig,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.createAppLogger('GoogleSMTPService');
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        host: this.config.host || 'smtp.gmail.com',
        port: this.config.port || 587,
        secure: this.config.secure || false, // true for 465, false for other ports
        auth: {
          user: this.config.user,
          pass: this.config.pass,
        },
      });

      // Verify connection
      this.transporter.verify((error, success) => {
        if (error) {
          this.logger.error(
            `SMTP connection verification failed: ${error.message}`,
          );
        }
      });
    } catch (error) {
      this.logger.error(
        `Failed to initialize SMTP transporter: ${error.message}`,
      );
      throw error;
    }
  }

  async sendEmail(options: EmailOptions): Promise<EmailSendResult> {
    try {
      this.logger.log(`Sending email to: ${options.to}`);

      const mailOptions = {
        from: options.from || this.config.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        cc: Array.isArray(options.cc) ? options.cc.join(', ') : options.cc,
        bcc: Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments?.map((att) => ({
          filename: att.filename,
          content: att.content,
          path: att.path,
          contentType: att.contentType,
        })),
      };

      const result = await this.transporter.sendMail(mailOptions);

      this.logger.log(
        `Email sent successfully. MessageId: ${result.messageId}`,
      );

      return {
        messageId: result.messageId,
        success: true,
      };
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return {
        messageId: '',
        success: false,
        error: error.message,
      };
    }
  }
}
