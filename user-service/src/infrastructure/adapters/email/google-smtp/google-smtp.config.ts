export interface GoogleSMTPConfig {
  user: string;
  pass: string;
  from: string;
  host: string;
  port: number;
  secure: boolean;
}

export const GOOGLE_SMTP_CONFIG_PROVIDER = 'GOOGLE_SMTP_CONFIG_PROVIDER';
