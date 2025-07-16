import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIGS, InfrasConfigModule } from './infrastructure/config';
import { InfrastructureTypeOrmModule } from './infrastructure/typeorm/typeorm.module';
import { LoggerModule } from './infrastructure/logger';
import { ConfigService } from '@nestjs/config';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { ExceptionFilterModule } from './infrastructure/exception-filters';
import { RedisInfrasModule } from './infrastructure/redis';
import { InfrasAuthenticationModule } from './infrastructure/authentication';
import { RequestTimeoutModule } from './infrastructure/request-timeout';

@Module({
  imports: [
    InfrasConfigModule.forRoot({
      envFilePath: '.env',
    }),
    InfrastructureTypeOrmModule,
    RedisInfrasModule,
    InfrasAuthenticationModule,
    RequestTimeoutModule,
    LoggerModule.forRootAsync({
      type: 'console',
      configProvider: {
        useFactory: (configService: ConfigService) =>
          configService.get(CONFIGS.LOGGER),
        inject: [ConfigService],
      },
    }),
    RecommendationModule,
    ExceptionFilterModule.forRoot({
      service: 'recommendation',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
