import {
  Global,
  Module,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIGS } from '../config';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';

@Global()
@Module({
  imports: [
    ConfigModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return configService.get(CONFIGS.OPENAI);
      },
      inject: [ConfigService],
    }),
  ],
})
export class RedisInfrasModule implements OnApplicationShutdown {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  onApplicationShutdown() {
    const client = this.redisService.getOrThrow();
    client.disconnect(false);

    console.log(`All redis clients were successfully disconnected ...`);
  }
}
