import { registerAs } from '@nestjs/config';

export default registerAs('openai', () => ({
  apiKey: process.env.OPENAI_API_KEY,
  baseUrl: process.env.OPENAI_API_BASE_URL,
  timeout: parseInt(process.env.OPENAI_API_TIMEOUT || '10000'),
}));
