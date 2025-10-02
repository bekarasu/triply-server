import CONFIGS from './config.constants';

export default () => ({
  [CONFIGS.SMTP]: {
    googleSMTP: {
      user: process.env.GOOGLE_SMTP_USER,
      pass: process.env.GOOGLE_SMTP_PASS,
      from: process.env.GOOGLE_SMTP_FROM || process.env.GOOGLE_SMTP_USER,
      host: process.env.GOOGLE_SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.GOOGLE_SMTP_PORT, 10) || 587,
      secure: process.env.GOOGLE_SMTP_SECURE === 'true' || false,
    },
  },
});
