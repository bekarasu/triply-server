import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONFIGS } from '../config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  private readonly models: Array<any>;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('openai.apiKey');
    const config = this.configService.get(CONFIGS.OPENAI);
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout;
    this.models = [
      {
        id: 'pmpt_68d5aa107b78819680545d5e1bff4a330b910fa9e526013e',
      },
      {
        id: 'pmpt_68d5aa107b78819680545d5e1bff4a330b910fa9e526013e',
      },
      {
        id: 'pmpt_68d5aa107b78819680545d5e1bff4a330b910fa9e526013e',
      },
      {
        id: 'pmpt_68d5aa107b78819680545d5e1bff4a330b910fa9e526013e',
      },
      {
        id: 'pmpt_68d5aa107b78819680545d5e1bff4a330b910fa9e526013e',
      },
    ];
  }

  async createJourneyPlan(
    payload: Array<{ num_days: number; city: string }>,
  ): Promise<any> {
    if (payload.length < 1 || payload.length > 5) {
      throw new Error('Payload length must be between 1 and 5');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const variables = {};
    payload.forEach((item, index) => {
      variables[`num_days_${index + 1}`] = item.num_days;
      variables[`city_${index + 1}`] = item.city;
    });

    const response = await openai.responses.create({
      prompt: {
        id: this.models[payload.length - 1].id,
        version: '2',
        variables,
      },
    });

    if (response.status !== 'completed') {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    return response.output_text;
  }
}
