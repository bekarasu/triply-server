import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIGS, InfrasConfigModule } from './infrastructure/config';
import { InfrastructureTypeOrmModule } from './infrastructure/typeorm/typeorm.module';
import { LoggerModule } from './infrastructure/logger';
import { ConfigService } from '@nestjs/config';
import { ExceptionFilterModule } from './infrastructure/exception-filters';
import { RedisInfrasModule } from './infrastructure/redis';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { RequestTimeoutModule } from './infrastructure/request-timeout';
import { SerializationModule } from './infrastructure/serialization';

@Module({
  imports: [
    InfrasConfigModule.forRoot({
      envFilePath: '.env',
    }),
    InfrastructureTypeOrmModule,
    RedisInfrasModule,
    RequestTimeoutModule,
    SerializationModule,
    ExceptionFilterModule.forRoot({
      service: 'user',
    }),
    LoggerModule.forRootAsync({
      type: 'console',
      configProvider: {
        useFactory: (configService: ConfigService) =>
          configService.get(CONFIGS.LOGGER),
        inject: [ConfigService],
      },
    }),
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
